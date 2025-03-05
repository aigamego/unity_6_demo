using Unity.Burst;
using Unity.Collections;
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;

[BurstCompile]
partial struct MonsterSpawn_System : ISystem
{
    // Timer to control the spawn interval
    // 用于控制生成间隔的计时器
    private float spawn_timer;

    // Random generator for assigning monster speeds
    // 用于分配怪物速度的随机生成器
    private Unity.Mathematics.Random random;

    // X and Y offsets for spawning monsters
    private float xOffset;
    private float yOffset;

    // Start position for spawning monsters (left-bottom corner)
    private float startX;
    private float startY;
    private float xMax;
    private float spawnInterval;


    [BurstCompile]
    public void OnCreate(ref SystemState state)
    {
        // Initialize the random generator with a fixed seed (or use a dynamic seed if needed)
        // 使用固定种子初始化随机生成器（如果需要，可以使用动态种子）
        random = new Unity.Mathematics.Random(12345);

        // Initialize the X and Y offsets and other parameters
        startX = -7f;
        startY = -7f;
        xMax = 15f;
        spawnInterval = 1f;


        xOffset = startX;
        yOffset = startY;

        // Optionally, you can perform an initial spawn here if needed.
        // 如果需要，也可以在这里进行初始生成。
    }

    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        // Increase the spawn timer by the time elapsed since the last frame
        // 累加自上帧以来经过的时间到 spawn_timer
        spawn_timer += SystemAPI.Time.DeltaTime;

        // Check if one second has passed to trigger the spawn event
        // 检查是否经过了一秒来触发生成事件
        if (spawn_timer >= 1.0f)
        {
            // Reset the timer
            // 重置计时器
            spawn_timer = 0f;

            // Ensure the MonsterSpawn_Data singleton exists before spawning monsters
            // 在生成怪物前确保 MonsterSpawn_Data 单例存在
            if (SystemAPI.TryGetSingleton<MonsterSpawn_Data>(out var data))
            {
                EntityManager entityManager = state.EntityManager;
                int monsterCount = 10; // Number of monsters to spawn 每次生成的怪物数量
                NativeArray<Entity> monsters = new NativeArray<Entity>(monsterCount, Allocator.Temp);

                // Instantiate monsters from the prefab provided in MonsterSpawn_Data
                // 根据 MonsterSpawn_Data 中提供的预制体实例化怪物
                entityManager.Instantiate(data.Prefab, monsters);

                // Loop through each monster and set its position, scale, and random speed
                // 遍历每个怪物，为其设置位置、缩放和随机速度
                for (int i = 0; i < monsters.Length; i++)
                {
                    // Set a simple grid position; adjust as needed for your game
                    // 设置简单的网格位置，每个怪物间隔 0.5 米
                    //float3 position = new float3((i % 100) * 0.5f, 0, (i / 100) * 0.5f);
                    float3 position = new float3(xOffset, 0, yOffset);

                    // Set position and scale (scale = 1)
                    // 设置位置和缩放（缩放值为 1）
                    entityManager.SetComponentData(monsters[i], new LocalTransform
                    {
                        Position = position,
                        Scale = 1f
                    });

                    // Assign a random speed between 1 and 5 using our random generator
                    // 使用我们的随机生成器为怪物分配 1 到 5 之间的随机速度
                    // 要先添加Monster
                    //entityManager.SetComponentData(monsters[i], new Monster { speed = random.NextFloat(1f, 5f) });

                    // Increment the offsets for the next monster
                    xOffset += spawnInterval;
                    if (xOffset > xMax)
                    {
                        xOffset = startX;
                        yOffset += spawnInterval;
                    }
                }

                // Dispose of the temporary NativeArray to free memory
                // 释放临时 NativeArray 内存
                monsters.Dispose();
            }
        }
    }


    [BurstCompile]
    public void OnDestroy(ref SystemState state)
    {
        // Clean-up if needed when the system is destroyed
        // 当系统销毁时，如有需要进行清理
    }
}