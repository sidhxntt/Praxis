##  Setup & Log Ingestion Workflow

### Steps to Run the System and Enable Audit Logs in Kibana

1. **Download and Run Redis Docker Image**

   ```bash
   docker run --name redis -p 6379:6379 -d redis
   ```


2. **Run Database Migrations**

   ```bash
   pdm run migrate
   ```

3. **Create Initial Users**

   ```bash
   pdm run user
   ```

4. **Seed the Database**

   ```bash
   pdm run seed
   ```

5. **Enable Elasticsearch**

   In your environment configuration, set:

   ```env
   ENABLE_ELASTICSEARCH=True
   ```

   Then start a **new terminal** to continue.

6. **Stop/Delete Redis Container**
   (Assuming Redis will now run via `docker-compose` or is no longer needed)

   ```bash
   docker stop redis && docker rm redis
   ```

7. **Run the ELK Stack in a New Terminal**

   ```bash
   pdm run elk
   ```

8. **Start Elasticsearch Logger (Filebeat Service)**

   ```bash
   pdm run elasti
   ```

9. **Trigger Logs by Using the API**

   Make sure to **interact with the API** (e.g. via Postman or browser) to generate **new audit logs**.
   Only after new logs are created will **Filebeat pick them up** and forward them to **Kibana**.

---

✅ Once logs are ingested, open **Kibana → Discover** and search under the `filebeat-*` index pattern to view logs.

