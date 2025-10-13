# 🚀 BGIN Agent Framework - Quick Start Guide

## ⚡ **FASTEST WAY TO GET STARTED**

### **Step 1: Install Required Tools (5 minutes)**

**Download and install these 4 tools:**

1. **Node.js** (REQUIRED) - JavaScript runtime
   - 🔗 **Download**: https://nodejs.org/
   - ✅ Choose **LTS version (20.x)**
   - ✅ Check "Add to PATH" during installation

2. **Docker Desktop** (REQUIRED) - Container platform
   - 🔗 **Download**: https://www.docker.com/products/docker-desktop/
   - ✅ Install and **restart your computer**
   - ✅ Start Docker Desktop after restart

3. **Git** (REQUIRED) - Version control
   - 🔗 **Download**: https://git-scm.com/download/win
   - ✅ Use default settings

4. **Ollama** (RECOMMENDED) - Local AI models
   - 🔗 **Download**: https://ollama.ai/download/windows
   - ✅ Install and start the service

### **Step 2: Install Project Dependencies (2 minutes)**

After installing the tools above, open Command Prompt or PowerShell in this directory and run:

```cmd
.\setup-project.bat
```

This will automatically:
- ✅ Install 100+ Node.js packages
- ✅ Set up environment configuration
- ✅ Start database services
- ✅ Download AI models

### **Step 3: Start the Application (30 seconds)**

```cmd
npm run dev
```

Then open your browser to: **http://localhost:4000**

---

## 🎯 **What You'll Get**

- **Multi-Agent AI System** with 3 specialized agents
- **Privacy-Preserving Research Platform**
- **Real-time Collaboration Tools**
- **Vector Database for Knowledge Search**
- **Modern React Interface**

---

## 🔧 **Troubleshooting**

If you encounter issues:

1. **Check tools are installed**:
   ```cmd
   .\install-dependencies.bat
   ```

2. **Restart Docker Desktop** if database errors occur

3. **Check ports are free**:
   - 3000 (Frontend)
   - 4000 (Backend)
   - 5432 (PostgreSQL)
   - 6379 (Redis)
   - 6333 (Qdrant)

---

## 📚 **Need Help?**

- **Full Documentation**: `BGIN_SETUP_COMPLETE.md`
- **System Requirements**: 8GB RAM, 10GB storage
- **Supported OS**: Windows 10+, macOS 10.15+, Linux Ubuntu 20.04+

---

**Ready to start? Install the 4 tools above, then run `.\setup-project.bat`!** 🚀
