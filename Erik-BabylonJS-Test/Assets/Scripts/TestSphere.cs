using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace PROJECT
{
    public class TestSphere : MonoBehaviour
    {
        public float forceMultiplier = 1.0f;

        private Rigidbody _rb = null;

        // Start is called before the first frame update
        void Start()
        {
            _rb = GetComponent<Rigidbody>();
        }

        // Update is called once per frame
        void FixedUpdate()
        {
            Vector3 vel = new Vector3(
                (Input.GetKey(KeyCode.A) ? -1 : 0) + (Input.GetKey(KeyCode.D) ? 1 : 0),
                0,
                (Input.GetKey(KeyCode.W) ? 1 : 0) + (Input.GetKey(KeyCode.S) ? -1 : 0));

            //Debug.Log($"({vel.x}, {vel.y}, {vel.z})");

            vel *= forceMultiplier;

            _rb.AddForce(vel, ForceMode.Force);
        }
    }
}
