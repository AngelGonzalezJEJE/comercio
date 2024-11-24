const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('node:path/win32')

describe('Users', () => {
  let token = "";
  let userId = "";

  // Run before all tests to register and log in the user
  beforeAll(async () => {
    // Register the user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: "testUser",
        email: "test@test.com",
        password: "123456789",
        edad: 33,
        ciudad: "Barinas",
        intereses: ["food"],
        permiteRecibirOfertas: true
      })
      .set('Accept', 'application/json')
      .expect(200);
    
    expect(registerResponse.body.user.nombre).toEqual('testUser');
    expect(registerResponse.body.user.email).toEqual('test@test.com');
    console.log("User registered:", registerResponse.body.user);

    // Log in with the registered user
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: "test@test.com", password: "123456789" })
      .expect(200);

    token = loginResponse.body.token;
    userId = loginResponse.body.user._id;
    console.log("User logged in, token:", token);
  });

  // Test: Get all websites
  it('should return all websites', async () => {
    const response = await request(app)
      .get('/api/paginaWeb')
      .set('Accept', 'application/json')
      .expect(200);

    console.log(response.body);
  });

  // Test: Filter websites by ciudad query parameter
  it('should filter websites by ciudad', async () => {
    const ciudad = 'Some City';
    const response = await request(app)
      .get('/api/paginaWeb?ciudad=' + ciudad)
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body.every(website => website.ciudad === ciudad)).toBe(true);
  });

  // Test: Filter websites by actividad query parameter
  it('should filter websites by actividad', async () => {
    const actividad = 'Some Activity';
    const response = await request(app)
      .get('/api/paginaWeb?actividad=' + actividad)
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body.every(website => website.actividad === actividad)).toBe(true);
  });

  // Test: Sort websites by scoring
  it('should sort websites by scoring', async () => {
    const response = await request(app)
      .get('/api/paginaWeb?scoring=true')
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body[0]).toHaveProperty('reseñas');
    expect(response.body[0].reseñas.scoring).toBeGreaterThanOrEqual(response.body[1].reseñas.scoring);
  });

  // Test: Rate a website with a comment
  it('should rate a website with a comment', async () => {
    const response = await request(app)
      .patch("/api/usuarios/rate/673377c6abb507ce4bfb1ce9")//website id
      .send({
        rating: 3,
        comentario: "I like the food but the attention needs improvement."
      })
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(200);

    console.log(response.body);
  });

  it('should update the user', async () => {
    const response = await request(app)
    .put(`/api/usuarios/${userId}`)
    .send({nombre:"testUpdatedUsername",edad:22 })
    .set('Authorization',`Bearer ${token}`)
    .set('Accept','application/json')
    .expect(200)

    console.log(response.body)

  })

  it('should delete the user', async () => {
    const response = await request(app)
    .delete(`/api/usuarios/${userId}?physical=true`)
    .set('Authorization', `Bearer ${token}`)
    expect(200)

    console.log(response)

  })

})


describe('AdminUser', () => {
  let token = ''
  let adminId = ''
  let Cif = ''

  beforeAll(async () => {

    const adminLoginResponse = await request(app)
    .post("/api/auth/login")
    .send({email:"arsido@gmail.com",password:"123456789"})
    .set("Accept","application/json")
    .expect(200)
    console.log(adminLoginResponse)
    token = adminLoginResponse.body.token
    adminId = adminLoginResponse.body.user._id
  })

  it('should create a commerce', async () => { 
    const response = await request(app)
    .post('/api/comercio')
    .send({
      nombre: "TestComerce",
      cif: "010101CIF",
      direccion: "TEST",
      email: "test@xxx.com",
      telefono: "123456789",
    })
    .set('Authorization', `Bearer ${token}`)
    .set('Accept','application/json')
    .expect(200)

    console.log(response)
  })

  it('should get all commerces', async () => {
    const response = await request(app)
    .get('/api/comercio')
    .set('Authorization', `Bearer ${token}`)

    console.log(response)
  })

  it('should get a commerce by its cif', async() => {
    const response = await request(app)
    .get("/api/comercio/010101CIF")
    .set('Authorization', `Bearer ${token}`)

    console.log(response)

  })

  it('should delete a commerce by its cif', async() => {
    const response = await request(app)
    .delete("/api/comercio/010101CIF?physical=true")
    .set('Authorization', `Bearer ${token}`)

    console.log(response)

  })

  

})

describe('Commerce', () => {

  let AdminToken = ''
  let adminId = ''
  let Cif = ''
  let commerceToken = ''
  let websiteId = ''

  beforeAll( async () => {

    const adminLoginResponse = await request(app)
    .post("/api/auth/login")
    .send({email:"arsido@gmail.com",password:"123456789"})
    .set("Accept","application/json")
    .expect(200)
    console.log(adminLoginResponse.body)
    AdminToken = adminLoginResponse.body.token
    adminId = adminLoginResponse.body.user._id

    const commerceCreationResponse = await request(app)
    .post('/api/comercio')
    .send({
      nombre: "TestComerce",
      cif: "010101CIF",
      direccion: "TEST",
      email: "test@xxx.com",
      telefono: "123456789",
    })
    .set('Authorization', `Bearer ${AdminToken}`)
    .set('Accept','application/json')
    .expect(200)

    console.log(commerceCreationResponse.body)

    Cif = commerceCreationResponse.body.nuevoComercio.cif
    commerceToken = commerceCreationResponse.body.token
  })

  it('should create a website for the commerce', async () => {
    const response = await request(app)
    .post("/api/paginaweb")
    .send({
      ciudad: "Test",
      actividad: "xxx",
      titulo: "Test",
      resumen: "teeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeest",
      textos: ["test","test","and test"]
    })
    .set('Authorization',`Bearer ${commerceToken}`)
    .set('Accept','aplication/json')
    expect(200)

    console.log(response.body)
    websiteId = response.body._id
    console.log(websiteId)
  })
  //yes, the email sender actually works trust me, if you want to test it go ahead but dont spam my email please XD
  /*it('should send an email',async() => {
    const response = await request(app)
    .post('/api/comercio/sendMail')
    .send({
      subject:"sexy",
      text:"sexy",
      to:"angel.dpsmsz@gmail.com"
    })
    .set('Authorization',`Bearer ${commerceToken}`)
    .set('Accept','aplication/json')
    .expect(200)

    console.log(response.body)

  })*/

  it('should update the commerce website', async () => {
    const response = await request(app)
    .put(`/api/paginaweb/${websiteId}`)
    .send({
      ciudad: "Barinas",
      actividad: "xxx",
      titulo: "TestUpdated",
      resumen: "teeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeestUpdaaaaaaaaaaaaaaaaaaaaaaaaated",
      textos: ["testUp","testDa","and testTed"]
    })
    .set('Authorization',`Bearer ${commerceToken}`)
    .set('Accept','aplication/json')
    expect(200)

    console.log(response.body)
    console.log(websiteId)
    console.log('Current working directory:', process.cwd());

  })

  it('should upload a pic or a text to the commerce website', async () => {
    const testImagePath = path.join(__dirname, 'princess.jpg')
    const textosArray = ['Test1', 'Test2']; // Example text array
    if (!fs.existsSync(testImagePath)) {
      throw new Error('Test image file does not exist');
    }
    const response = await request(app)
    .patch(`/api/paginaweb/img`)
    .set('Authorization', `Bearer ${commerceToken}`)
    .field('textos', JSON.stringify(textosArray))
    .attach('image', testImagePath) // Simulate image file upload
    .expect(200);

    console.log(response.body)
  })

  it('it should get interested users', async () => {
    const response = await request(app)
    .get('/api/comercio/inter')
    .set('Authorization', `Bearer ${commerceToken}`)
    expect(200)

    console.log(response.body)

  })
  
  it('should delete the commerce website', async () => {
    const response = await request(app)
    .delete(`/api/paginaweb/${websiteId}`)
    .set('Authorization', `Bearer ${commerceToken}`)
    expect(200)

    console.log(response.body)
  })

  it('should delete a commerce by its cif', async() => {
    const response = await request(app)
    .delete(`/api/comercio/${Cif}?physical=true`)
    .set('Authorization', `Bearer ${AdminToken}`)

    console.log(response.body)
  })


})
