using Unity.Collections;
using Unity.Entities;
using Unity.Mathematics;
using UnityEngine;
using UnityEngine.Serialization;

public class MonsterSpawn_Authoring : MonoBehaviour
{
    /// <summary>
    /// Monster Prefab
    /// </summary>
    public GameObject prefab;
}

class MonsterSpawn_AuthoringBaker : Baker<MonsterSpawn_Authoring>
{
    public override void Bake(MonsterSpawn_Authoring authoring)
    {
        if (authoring == null || authoring.prefab == null)
        {
            Debug.LogError($"MonsterSpawn_Authoring or prefab is null");
            return;
        }
        
        var entity = GetEntity(TransformUsageFlags.None);
        if (entity == Entity.Null)
        {
            Debug.LogError($"Error in baking entity or prefab entity");
            return;
        }

        AddComponent(entity, new MonsterSpawn_Data
        {
            Prefab = GetEntity(authoring.prefab, TransformUsageFlags.Dynamic)
        });

    }
}
