const app = require("../src/index"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);


// Mock di un token valido per autenticazione
const validToken = "Bearer your_valid_token_here";

describe("API Endpoints Testing", () => {
  test("Recupero di tutti i POI", async () => {
    const res = await request.get("/api/app/getAllPois");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("test", async () => {
    const res = await request.get("/api/app/test");
    expect(res.body).toHaveProperty("message");
  });

  test("Aggiunta di un POI valido", async () => {
    const newPoi = { properties: { name: "Nuovo POI", description: "Descrizione test" } };
    const res = await request.post("/api/app/addPoi").send(newPoi);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  test("Aggiunta di un POI con dati mancanti", async () => {
    const incompletePoi = { properties: {} };
    const res = await request.post("/api/app/addPoi").send(incompletePoi);
    expect(res.status).toBe(400);
  });

  test("Eliminazione POI con richiesta valida", async () => {
    const poiId = "your_existing_poi_id_here";
    const res = await request.delete("/api/app/deletePois").send({ _id: poiId });
    expect(res.status).toBe(204);
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
    const poiId = "your_existing_poi_id_here";
    const res = await request.get(`/api/app/pois/${poiId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
  });

  test("Modifica POI con dati validi", async () => {
    const poiId = "your_existing_poi_id_here";
    const updatedData = { properties: { name: "POI Modificato", description: "Nuova descrizione" } };
    const res = await request.put(`/api/app/pois/${poiId}`).send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.properties.name).toBe("POI Modificato");
  });

  test("Registrazione utente con credenziali valide", async () => {
    const user = { username: "testUser", password: "password123" };
    const res = await request.post("/api/authn/signup").send(user);
    expect(res.status).toBe(201);
  });

  test("Registrazione utente con username già esistente", async () => {
    const user = { username: "testUser", password: "password123" };
    await request.post("/api/authn/signup").send(user);
    const res = await request.post("/api/authn/signup").send(user);
    expect(res.status).toBe(400);
  });

  test("Login con credenziali errate", async () => {
    const credentials = { username: "testUser", password: "wrongPassword" };
    const res = await request.post("/api/authn/login").send(credentials);
    expect(res.status).toBe(401);
  });

  test("Login con credenziali valide", async () => {
    const credentials = { username: "testUser", password: "password123" };
    const res = await request.post("/api/authn/login").send(credentials);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Refresh token valido", async () => {
    const res = await request.post("/api/authn/refresh").set("Authorization", validToken);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Logout utente", async () => {
    const res = await request.post("/api/authn/logout").set("Authorization", validToken);
    expect(res.status).toBe(200);
  });
});
