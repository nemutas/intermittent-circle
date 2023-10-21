import * as THREE from 'three'
import { three } from './core/Three'
import fragmentShader from './shader/screen.frag'
import vertexShader from './shader/screen.vert'
import { gui } from './Gui'

export class Canvas {
  private screen!: THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial>

  constructor(canvas: HTMLCanvasElement) {
    this.load().then((textures) => {
      this.init(canvas)
      this.screen = this.createScreen(textures[0])
      this.addEvents()
      three.animation(this.anime)
    })
  }

  private async load() {
    const loader = new THREE.TextureLoader()
    const files = ['unsplash.webp']

    return Promise.all(
      files.map(async (file) => {
        const texture = await loader.loadAsync(import.meta.env.BASE_URL + `images/${file}`)
        texture.name = file.split('.')[0]
        texture.userData.aspect = texture.source.data.width / texture.source.data.height
        texture.wrapS = THREE.MirroredRepeatWrapping
        texture.wrapT = THREE.MirroredRepeatWrapping
        return texture
      }),
    )
  }

  private init(canvas: HTMLCanvasElement) {
    three.setup(canvas)
    three.scene.background = new THREE.Color('#000')
  }

  private createScreen(texture: THREE.Texture) {
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        tImage: { value: texture },
        uScale: { value: three.coveredScale(texture.userData.aspect) },
        uAspect: { value: three.size.aspect },
        uSplit: { value: 20 },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    })
    const mesh = new THREE.Mesh(geometry, material)
    three.scene.add(mesh)

    gui.add(material.uniforms.uSplit, 'value', 5, 100, 5).name('split')

    return mesh
  }

  private addEvents() {
    three.addEventListener('resize', () => {
      const uniforms = this.screen.material.uniforms
      uniforms.uScale.value = three.coveredScale(uniforms.tImage.value.userData.aspect)
      uniforms.uAspect.value = three.size.aspect
    })
  }

  private anime = () => {
    this.screen.material.uniforms.uTime.value += three.time.delta
    three.render()
  }

  dispose() {
    three.dispose()
  }
}
