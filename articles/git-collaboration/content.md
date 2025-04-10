# Git para Trabajos Colaborativos en Proyectos Web

Git es una herramienta esencial en el desarrollo web moderno, especialmente cuando trabajamos en equipo. En este artículo, aprenderemos los comandos más importantes de Git para colaborar eficientemente en proyectos web.

## Configuración Inicial

Antes de comenzar a trabajar con Git, necesitamos configurar nuestra identidad:

```bash
# Configurar nombre de usuario
git config --global user.name "Tu Nombre"

# Configurar email
git config --global user.email "tu@email.com"
```

## Comandos Básicos para Trabajo en Equipo

### 1. Clonar un Repositorio

Para comenzar a trabajar en un proyecto existente:

```bash
git clone https://github.com/usuario/repositorio.git
cd repositorio
```

### 2. Gestión de Ramas

Las ramas son fundamentales para el trabajo colaborativo:

```bash
# Crear una nueva rama
git branch feature/nueva-funcionalidad

# Cambiar a la nueva rama
git checkout feature/nueva-funcionalidad

# Crear y cambiar a una nueva rama (atajo)
git checkout -b feature/nueva-funcionalidad
```

### 3. Actualizar y Publicar

Mantén tu código sincronizado con el equipo:

```bash
# Obtener cambios del repositorio remoto
git pull origin main

# Publicar tus cambios
git push origin feature/nueva-funcionalidad
```

### 4. Gestión de Cambios

El flujo básico para guardar cambios:

```bash
# Ver estado de archivos
git status

# Añadir archivos modificados
git add .

# Crear un commit
git commit -m "Descripción clara del cambio"

# Ver historial de commits
git log --oneline
```

## Flujo de Trabajo en Equipo

### 1. Feature Branch Workflow

Este es el flujo de trabajo recomendado:

1. Crear una rama para la nueva funcionalidad
2. Desarrollar y hacer commits
3. Actualizar la rama con main
4. Crear Pull Request
5. Code Review
6. Merge a main

```bash
# 1. Crear y cambiar a nueva rama
git checkout -b feature/login-system

# 2. Desarrollar y commit
git add .
git commit -m "Implementa sistema de login"

# 3. Actualizar con main
git checkout main
git pull
git checkout feature/login-system
git merge main

# 4. Publicar rama
git push origin feature/login-system
```

### 2. Resolución de Conflictos

Cuando ocurren conflictos:

```bash
# 1. Git marcará los archivos con conflictos
git status

# 2. Abrir los archivos y resolver conflictos
# Los conflictos se marcan así:
<<<<<<< HEAD
tu código
=======
código del otro desarrollador
>>>>>>> branch-name

# 3. Después de resolver
git add .
git commit -m "Resuelve conflictos en login"
```

## Comandos Avanzados

### 1. Stash

Para guardar cambios temporalmente:

```bash
# Guardar cambios en el stash
git stash save "Cambios en progreso del login"

# Ver lista de stash
git stash list

# Recuperar cambios
git stash pop

# Eliminar stash
git stash drop
```

### 2. Rebase

Para mantener el historial limpio:

```bash
# Actualizar rama con rebase
git checkout feature/login
git rebase main

# Rebase interactivo para limpiar commits
git rebase -i HEAD~3
```

## Mejores Prácticas

1. **Commits Descriptivos**
   - Usa mensajes claros y concisos
   - Sigue un formato consistente
   - Incluye el contexto necesario

2. **Ramas Organizadas**
   - `feature/` para nuevas funcionalidades
   - `fix/` para correcciones
   - `hotfix/` para emergencias
   - `release/` para versiones

3. **Pull Requests**
   - Describe claramente los cambios
   - Incluye capturas de pantalla si es necesario
   - Referencia issues relacionados
   - Solicita revisión a compañeros específicos

## Configuración de GitHub

### 1. Archivo .gitignore

```plaintext
# Dependencias
node_modules/
vendor/

# Archivos de entorno
.env
.env.local

# Archivos de sistema
.DS_Store
Thumbs.db

# Archivos de compilación
dist/
build/
```

### 2. GitHub Actions Básico

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
    - run: npm install
    - run: npm test
```

## Conclusión

Git es una herramienta poderosa que, cuando se usa correctamente, puede hacer que el trabajo en equipo sea mucho más eficiente. Los comandos y prácticas que hemos visto son la base para una colaboración exitosa en proyectos web.

Recuerda:
- Mantén tus commits pequeños y enfocados
- Actualiza tu rama frecuentemente
- Comunica tus cambios al equipo
- Documenta tu código
- Revisa el código de otros

## Recursos Adicionales

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/) 