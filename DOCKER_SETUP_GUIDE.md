# 🐳 BGIN Agent Framework - Docker Setup Guide

## 🚀 **Quick Start with Docker**

The BGIN Agent Framework is designed to work seamlessly with Docker. This approach handles all dependencies automatically!

### **Step 1: Install Docker Desktop**

**Download and install Docker Desktop:**
- 🔗 **Download**: https://www.docker.com/products/docker-desktop/
- ✅ Install Docker Desktop
- ✅ **Restart your computer** after installation
- ✅ Start Docker Desktop and ensure it's running

### **Step 2: Verify Docker Installation**

Open Command Prompt or PowerShell and run:
```cmd
docker --version
docker-compose --version
```

You should see version numbers for both commands.

### **Step 3: Start BGIN Agent Framework**

Navigate to the project directory and run:
```cmd
cd BGIN-Agent-Framework-main
docker-compose up -d
```

This will automatically:
- ✅ Download all required Docker images
- ✅ Start PostgreSQL database
- ✅ Start Redis cache
- ✅ Start Qdrant vector database
- ✅ Build and start the backend API
- ✅ Build and start the frontend application

### **Step 4: Access the Application**

Once everything is running:
- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/health

### **Step 5: View Logs (Optional)**

To see what's happening:
```cmd
docker-compose logs -f
```

To see logs for specific services:
```cmd
docker-compose logs -f backend
docker-compose logs -f frontend
```

### **Step 6: Stop the Application**

When you're done:
```cmd
docker-compose down
```

## 🔧 **Docker Services Included**

The `docker-compose.yml` file includes:

1. **PostgreSQL** (Port 5432) - Main database
2. **Redis** (Port 6379) - Caching and sessions
3. **Qdrant** (Port 6333) - Vector database for AI
4. **Backend API** (Port 4000) - Node.js/Express server
5. **Frontend** (Port 3000) - React application

## 🎯 **What You Get**

- **Multi-Agent AI System** with 3 specialized agents
- **Privacy-Preserving Research Platform**
- **Real-time Collaboration Tools**
- **Vector Database for Knowledge Search**
- **Modern React Interface**
- **Complete Development Environment**

## 🚨 **Troubleshooting**

### **Docker Not Starting**
- Make sure Docker Desktop is running
- Check if virtualization is enabled in BIOS
- Restart Docker Desktop

### **Port Conflicts**
If ports 3000, 4000, 5432, 6379, or 6333 are in use:
```cmd
# Check what's using the ports
netstat -ano | findstr :4000
netstat -ano | findstr :5432

# Kill processes if needed (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### **Permission Issues**
- Run Command Prompt as Administrator
- Ensure Docker Desktop has proper permissions

## 📚 **Advanced Usage**

### **Development Mode**
```cmd
# Start with file watching for development
docker-compose up -d
npm run dev
```

### **Production Mode**
```cmd
# Start production build
docker-compose -f docker-compose.production.yml up -d
```

### **Reset Everything**
```cmd
# Stop and remove all containers and volumes
docker-compose down -v
docker system prune -a
```

---

## 🎉 **Ready to Start!**

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop/
2. **Restart your computer**
3. **Run**: `docker-compose up -d`
4. **Open**: http://localhost:4000

**That's it! Your BGIN Agent Framework will be running in minutes!** 🚀
