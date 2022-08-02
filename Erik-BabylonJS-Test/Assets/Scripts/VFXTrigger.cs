using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace PROJECT
{
    public class VFXTrigger : MonoBehaviour
    {
        public ParticleSystem particles;

        private void OnTriggerEnter()
        {
            particles.Play();
        }
    }
}
