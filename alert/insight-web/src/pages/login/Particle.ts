import * as THREE from 'three';

class Particle {
  container: HTMLElement;
  particleNumber = 3;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  cubeSize: number;
  blockTime: number;
  TransactionsPerSecond;
  activeStep;

  renderer: THREE.WebGLRenderer | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  lights: THREE.PointLight[] | undefined;
  scene: THREE.Scene | undefined;
  cube: THREE.Object3D<THREE.Object3DEventMap> | undefined;
  rotationX: number | undefined;
  rotationY: number | undefined;
  mouseX: number | undefined;
  mouseY: number | undefined;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;

  constructor(dom = 'btn') {
    this.container = document.getElementById(dom)!;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.cubeSize = 80;
    this.blockTime = 5000;
    this.TransactionsPerSecond = 2000;
    this.activeStep = 1;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  public initApp() {
    this.initRenderer();
    this.launchApp();
    this.initMouseEvents();

    this.animate();
  }

  /**
   * =======
   * 初始化渲染器
   * =======
   */
  protected initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setClearColor(0x000000, 1);
    this.renderer.sortObjects = false;
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1000, 4000);

    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 10000);
    this.camera.position.set(0, 0, 1000);

    this.scene.add(this.camera);

    const ambientLight = new THREE.AmbientLight(0x999999, 0.8);
    this.scene.add(ambientLight);

    // const self = this;

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  /**
   * =======
   * 启动应用
   * =======
   */
  protected launchApp() {
    this.cube = this.createCubeGroup();
    this.cube.rotation.y = 0.225;
    this.cube.rotation.x = 0.225;
    this.scene!.add(this.cube!);
  }

  protected createCubeGroup() {
    const cubeGroup = new THREE.Object3D();

    const cube = this.createCube();
    // const dataMesh = this.generateCubeData();

    // cubeGroup.add(dataMesh);
    this.createCubeLights(cubeGroup);
    cubeGroup.add(cube);

    return cubeGroup;
  }

  /**
   * =======
   * 创建立方体
   * =======
   * @returns
   */
  protected createCube() {
    // const geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
    const geometry = new THREE.SphereGeometry(this.cubeSize / 2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      // 主题色
      color: 0x01bc8d,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true,
      // 材料反射光
      reflectivity: 100,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = 'cubeGeometry';

    return cube;
  }

  /**
   * =======
   * 创建立方体灯光
   * =======
   * @param cubeGroup
   */
  protected createCubeLights(cubeGroup: THREE.Object3D<THREE.Object3DEventMap>) {
    this.lights = [];
    const colors = ['54BE68', '2CB060', '1AA261', '0C8D64', '037868'];

    for (let i = 0; i < 4; i++) {
      const color = parseInt(colors[i % colors.length], 16);
      let light = new THREE.PointLight(color, 50, 100);
      light.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(8, 16, 8),
          new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            alphaTest: 0.5,
            opacity: 1,
          }),
        ),
      );

      light.name = 'cubeLights';
      cubeGroup.add(light);
      this.lights.push(light);
    }
  }

  /**
   * =======
   * 生成数据
   * =======
   * @returns
   */
  // public generateCubeData() {
  //   // const randomTransactionsNumber = Math.floor(Math.random() * (((this.blockTime / 1000) * this.TransactionsPerSecond) - 0)) + 0;
  //   // const transactionsNumber = randomTransactionsNumber.toString();

  //   const dataMesh = this.generateDataTexture(
  //     // transactionsNumber
  //   );
  //   dataMesh.name = "cubeText";

  //   return dataMesh;
  // }

  /**
   * =======
   * 生成数据纹理
   * =======
   * @param transactionsNumber
   * @returns
   */
  // public generateDataTexture(
  //   // transactionsNumber: string
  // ) {
  //   const bitmap = document.createElement('canvas');
  //   const ctx = bitmap.getContext('2d') as CanvasRenderingContext2D;

  //   const text = "Microsoft 登录"; // 文本内容
  //   const x = 65; // 文本左上角的x坐标
  //   const y = 128; // 文本左上角的y坐标

  //   // console.log('blockNumber', transactionsNumber);
  //   bitmap.width = 256;
  //   bitmap.height = 256;

  //   // 绘制圆角矩形
  //   function drawRoundedRect(_ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  //     _ctx.beginPath();
  //     _ctx.moveTo(x + radius, y);
  //     _ctx.lineTo(x + width - radius, y);
  //     _ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  //     _ctx.lineTo(x + width, y + height - radius);
  //     _ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  //     _ctx.lineTo(x + radius, y + height);
  //     _ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  //     _ctx.lineTo(x, y + radius);
  //     _ctx.quadraticCurveTo(x, y, x + radius, y);
  //     _ctx.closePath();

  //     // 填充颜色
  //     // ctx.fillStyle = '#01bc8d';
  //     ctx.fill();
  //   }

  //   // 绘制边框
  //   function drawRoundedBorder(_ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  //     _ctx.lineWidth = 2; // 边框宽度
  //     _ctx.strokeStyle = '#01bc8d'; // 边框颜色
  //     _ctx.strokeRect(x, y, width, height); // 绘制矩形边框
  //     _ctx.stroke();
  //   }

  //   // 绘制带边框的圆角矩形
  //   const rectX = x - 10; // 矩形左上角的x坐标
  //   const rectY = y - 30; // 矩形左上角的y坐标
  //   const rectWidth = ctx.measureText(text).width * 2 + 10; // 矩形宽度增加一定的边距
  //   const rectHeight = 45; // 矩形高度

  //   drawRoundedRect(ctx, rectX, rectY, rectWidth, rectHeight, 10); // 绘制填充的圆角矩形
  //   drawRoundedBorder(ctx, rectX, rectY, rectWidth, rectHeight); // 绘制边框

  //   // 绘制文本
  //   ctx.fillStyle = '#01bc8d'; // 文本颜色
  //   ctx.font = '20px Arial'; // 字体样式
  //   ctx.fillText(text, x, y); // 在指定位置绘制文本

  //   const geometry = new THREE.PlaneGeometry(this.cubeSize * 0.9, this.cubeSize * 0.9);
  //   const texture = new THREE.CanvasTexture(bitmap);
  //   const material = new THREE.MeshBasicMaterial({
  //     map: texture,
  //     transparent: true,
  //     color: 0xffffff,
  //     opacity: 1,
  //     depthWrite: false,
  //     reflectivity: 100
  //   });
  //   const dataMesh = new THREE.Mesh(geometry, material);
  //   dataMesh.position.set(0, 0, this.cubeSize / 4);

  //   return dataMesh;
  // }

  /**
   * =======
   * 窗口调整
   * =======
   */
  public onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    this.camera!.aspect = this.width / this.height;
    this.camera!.updateProjectionMatrix();

    this.renderer!.setSize(this.width, this.height);
  }

  /**
   * =======
   * 粒子动画
   * =======
   * @param now
   */
  protected animate(now: number | undefined = 0) {
    requestAnimationFrame(this.animate.bind(this));

    if (this.cube && this.rotationX && this.rotationY) {
      this.cube.rotation.y += (this.rotationX - this.cube.rotation.y) * 0.05;
      this.cube.rotation.x += (this.rotationY - this.cube.rotation.x) * 0.05;
    }

    const r = 60;
    if (this.lights) {
      this.lights[0].position.y = Math.cos(now * (1 * 0.5 + 1) * 0.001) * r;
      this.lights[0].position.x = Math.sin(now * (1 * 0.5 + 1) * 0.001) * r;
      this.lights[0].position.z = Math.sin(now * (1 * 0.5 + 1) * 0.001) * r;
      this.lights[1].position.y = Math.sin(now * (1.2 * 0.5 + 1) * 0.001) * r;
      this.lights[1].position.x = Math.sin(now * (1.2 * 0.5 + 1) * 0.001) * r;
      this.lights[1].position.z = Math.cos(now * (1.2 * 0.5 + 1) * 0.001) * r;
      this.lights[2].position.y = Math.sin(now * (1.4 * 0.5 + 1) * 0.001) * r;
      this.lights[2].position.x = Math.cos(now * (1.4 * 0.5 + 1) * 0.001) * r;
      this.lights[2].position.z = Math.sin(now * (1.4 * 0.5 + 1) * 0.001) * r;
      // this.lights[3].position.y = Math.cos((now * (1.6 * 0.5 + 1)) * 0.001) * 160;
      // this.lights[3].position.x = Math.cos((now * (1.6 * 0.5 + 1)) * 0.001) * 160;
      // this.lights[3].position.z = Math.sin((now * (1.6 * 0.5 + 1)) * 0.001) * 160;
      // this.lights[4].position.y = Math.sin((now * (1.8 * 0.5 + 1)) * 0.001) * 160;
      // this.lights[4].position.x = Math.cos((now * (1.8 * 0.5 + 1)) * 0.001) * 160;
      // this.lights[4].position.z = Math.cos((now * (1.8 * 0.5 + 1)) * 0.001) * 160;
    }

    this.renderer!.render(this.scene!, this.camera!);
    // this.raycaster.setFromCamera(this.mouse, this.camera!);
    // const intersects = this.raycaster.intersectObjects([this.scene!.getObjectByName('cubeGeometry')!]);
    // // 如果鼠标悬停在立方体上
    // if (intersects.length > 0) {
    //   console.log('intersects.hover', intersects);
    //   // @ts-ignore
    //   intersects[0].object.material.color.setHex(0x01bc8d);
    // } else {
    //   // @ts-ignore
    //   this.scene!.getObjectByName('cubeGeometry')!.material.color.setHex(0x11111f);
    // }
  }

  /**
   * =======
   * 找到鼠标位置
   * （有兼容性问题）
   * =======
   * @param event
   */
  protected findMouseCoords(event: MouseEvent) {
    if (event) {
      //FireFox
      this.mouseX = event.pageX - document.body.scrollLeft;
      this.mouseY = event.pageY - document.body.scrollTop;
    } else {
      //IE
      // this.mouseX = window.event.x + 2;
      // this.mouseY = window.event.y + 2;
    }

    const diffX = this.mouseX! - this.centerX;
    const diffY = this.mouseY! - this.centerY;
    const percentX = diffX / this.centerX;
    const percentY = diffY / this.centerY;

    this.rotationX = percentX / 2;
    this.rotationY = percentY / 2;
  }

  /**
   * =======
   * 初始化鼠标事件（全局监听）
   * =======
   */
  protected initMouseEvents() {
    this.container.addEventListener('mousemove', this.findMouseCoords.bind(this));

    // 监听鼠标移动事件
    // window.addEventListener('mousemove', (event) => {
    //   // 将鼠标坐标转换到 [-1, 1] 范围
    //   this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // });
    // // 监听点击事件
    // window.addEventListener('click', () => {
    //   this.raycaster.setFromCamera(this.mouse, this.camera!);
    //   const intersects = this.raycaster.intersectObjects([this.scene!.getObjectByName('cubeGeometry')!]);
    //   if (intersects.length > 0) {
    //     // 如果点击了立方体
    //     // intersects[0].object.material.color.setHex(Math.random() * 0xffffff); // 更改颜色
    //     window.location.href = LOGIN_URL;
    //     console.log('intersects.click', intersects);
    //   }
    // }, true);
  }

  /**
   * =======
   * 停止监听鼠标事件（全局监听）
   * =======
   */
  protected stopMouseEvents() {
    this.container.removeEventListener('mousemove', this.findMouseCoords.bind(this));
  }

  /**
   * =======
   * 开始
   * =======
   */
  public start() {
    this.initApp();
  }

  /**
   * =======
   * 销毁
   * =======
   */
  public destroy() {
    this.stopMouseEvents();
    this.container.removeChild(this.renderer!.domElement);
  }
}

export default Particle;
