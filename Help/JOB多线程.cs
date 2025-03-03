 1public struct MinionFlightJob : IJobParallelFor
 2{
 3    public ComponentDataArray<UnitTransformData> flyingUnits;
 4    public ComponentDataArray<TextureAnimatorData> textureAnimators;
 5    public ComponentDataArray<RigidbodyData> rigidbodies;
 6    public ComponentDataArray<MinionData> minionData;
 7
 8    [ReadOnly]
 9    public NativeArray<RaycastHit> raycastHits;
10
11    [ReadOnly]
12    public float dt;
13
14    public void Execute(int index)
15    {
16        var rigidbody = rigidbodies[index];
17        var transform = flyingUnits[index];
18        var textureAnimator = textureAnimators[index];
19
20        textureAnimator.NewAnimationId = AnimationName.Falling;
21        transform.Position = transform.Position + rigidbody.Velocity * dt;
22        rigidbody.Velocity.y = rigidbody.Velocity.y + SimulationState.Gravity * dt;
23        // add damping
24
25        if (transform.Position.y < raycastHits[index].point.y)
26        {
27            var minion = minionData[index];
28            minion.Health = 0;
29            minionData[index] = minion;
30        }
31
32        rigidbodies[index] = rigidbody;
33        flyingUnits[index] = transform;
34        textureAnimators[index] = textureAnimator;
35    }
36}