require("dotenv").config({ path: require("path").resolve(__dirname, "../src/.env.dev") });
const app = require("../src/index"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const { v4: uuidv4 } = require('uuid');

// Mock di un token valido per autenticazione
const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.l26Q8388Uoz46WuvtDzVetoMwSeMV0uwlzNDdhDFhiY";
let testingPoi;
let testingOperator;

describe("API Endpoints Testing", () => {
  test("Recupero di tutti i POI", async () => {
    const res = await request.get("/api/app/getAllPois");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Aggiunta di un POI valido", async () => {
    const newPoi = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]] // Esempio di poligono chiuso
      },
      properties: {
        name: "Nuovo POI",
        description: "Descrizione test",
        category: "place" 
      }
    };

    const res = await request.post("/api/app/addPoi").send(newPoi);
    testingPoi = res.body;
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });


  test("Aggiunta di un POI con dati mancanti", async () => {
    const incompletePoi = { properties: {} };
    const res = await request.post("/api/app/addPoi").send(incompletePoi);
    expect(res.status).toBe(400);
  });

  test("Upload immagini senza file", async () => {
    const res = await request.post("/api/app/upload-images");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No images uploaded");
  });

  test("Recupero POI inesistente", async () => {
    const res = await request.get("/api/app/pois/invalid_id");
    expect(res.status).toBe(404);
  });

  test("Recupero POI valido", async () => {
    const poiId = testingPoi._id;
    const res = await request.get(`/api/app/pois/${poiId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
  });

  test("Modifica POI con dati validi", async () => {
    const poiId = testingPoi._id;
    const updatedData = { properties: { name: "POI Modificato", description: "Nuova descrizione" } };
    const res = await request.put(`/api/app/pois/${poiId}`).send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.properties.name).toBe("POI Modificato");
  });

  test("Eliminazione POI con richiesta valida", async () => {
    const poiId = testingPoi._id;
    const res = await request.delete("/api/app/deletePois").send({ ids: [poiId] });
    expect(res.status).toBe(204);
  });

  test("Registrazione utente con credenziali valide", async () => {
    const uid = uuidv4();
    testingOperator = {
      "email":`${uid}@mail.com`,
      "password":"password",
      "username":`${uid}`
    }
    
    const res = await request.post("/api/authn/signup").send(testingOperator);
    expect(res.status).toBe(201);
  });

  test("Registrazione utente con username già esistente", async () => {
    const user = {
      "email":"test2@mail.com",
      "password":"password2",
      "username":"testName2"
    };
    const res = await request.post("/api/authn/signup").send(user);
    expect(res.status).toBe(400);
  });

  test("Login con credenziali errate", async () => {
    const credentials = { email: testingOperator.email, password: "wrongPassword" };
    const res = await request.post("/api/authn/login").send(credentials);
    expect(res.status).toBe(401);
  });

  test("Login con credenziali valide", async () => {
    const credentials = { email: testingOperator.email, password: testingOperator.password };
    const res = await request.post("/api/authn/login").send(credentials);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success");
  });

  test("Logout utente", async () => {
    const res = await request.post("/api/authn/logout").set("Authorization", validToken);
    expect(res.status).toBe(200);
  });
});
