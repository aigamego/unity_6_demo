using Unity.Burst;
using Unity.Collections;
using Unity.Entities;
using Unity.Jobs;
using Unity.Mathematics;
using Unity.Transforms;

partial struct MonsterSpawn_System : ISystem
{
    // 声明一个 float 类型的生成计时器
    private float spawn_timer;
    
    [BurstCompile]
    public void OnCreate(ref SystemState state)
    {
        EntityQuery query = state.GetEntityQuery(ComponentType.ReadOnly<MonsterSpawn_Data>());
        var spawnData = query.GetSingleton<MonsterSpawn_Data>();

        EntityManager entityManager = state.EntityManager;
        NativeArray<Entity> monsters = new NativeArray<Entity>(100, Allocator.Temp);

        entityManager.Instantiate(spawnData.Prefab, monsters);

        for (int i = 0; i < monsters.Length; i++)
        {
            float3 position = new float3(i % 100, 0, i / 100);
            entityManager.SetComponentData(monsters[i], new LocalTransform { Position = position });
            entityManager.SetComponentData(monsters[i], new Monster { speed = UnityEngine.Random.Range(1f, 5f) });
        }

        monsters.Dispose();
    }

 [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        // 增加 spawn_timer
        spawn_timer += SystemAPI.Time.DeltaTime;

        // 将 spawn_timer 转为整数类型
        int intSpawnTimer = (int)(spawn_timer * 1000);

        // Check if the MonsterSpawn_Data exists
        if (SystemAPI.TryGetSingleton<MonsterSpawn_Data>(out var data))
        {
            
            
        }
    }

    [BurstCompile]
    public void OnDestroy(ref SystemState state)
    {
    }
}