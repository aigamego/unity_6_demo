using Unity.Entities;

/// <summary>
/// 怪出生需要的数据
/// </summary>
[ChunkSerializable]
public class MonsterSpawn_Data: IComponentData
{
    /// <summary>
    /// 怪物的预制体实体
    /// </summary>
    public Entity Prefab;
}

public struct Monster : IComponentData
{
    public float speed;
}