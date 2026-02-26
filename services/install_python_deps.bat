@echo off
REM ========================================
REM Python项目依赖安装脚本
REM 用于自动安装ai-service的Python依赖
REM ========================================

echo.
echo ========================================
echo Python项目依赖安装脚本
echo ========================================
echo.

REM 检查Python是否安装
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到Python，请先安装Python 3.10或更高版本
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/6] 检查Python版本...
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo Python版本: %PYTHON_VERSION%
echo.

echo [2/6] 进入ai-service目录...
cd /d "%~dp0ai-service"
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 无法进入ai-service目录
    pause
    exit /b 1
)
echo [成功] 当前目录: %CD%
echo.

echo [3/6] 创建虚拟环境...
if exist venv (
    echo [提示] 虚拟环境已存在，跳过创建
) else (
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 创建虚拟环境失败
        pause
        exit /b 1
    )
    echo [成功] 虚拟环境创建成功
)
echo.

echo [4/6] 激活虚拟环境...
call venv\Scriptsctivate.bat
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 激活虚拟环境失败
    pause
    exit /b 1
)
echo [成功] 虚拟环境已激活
echo.

echo [5/6] 升级pip...
python -m pip install --upgrade pip
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 升级pip失败，将继续安装依赖
) else (
    echo [成功] pip已升级
)
echo.

echo [6/6] 安装项目依赖...
echo [6.1] 尝试使用 pip install -e . 安装...
pip install -e .
if %ERRORLEVEL% NEQ 0 (
    echo [警告] pip install -e . 失败，将手动安装核心依赖
    echo.
    echo [6.2] 手动安装核心依赖...

    echo 安装 psycopg2-binary...
    pip install psycopg2-binary==2.9.9
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 安装psycopg2-binary失败
        pause
        exit /b 1
    )

    echo 安装 fastapi...
    pip install fastapi==0.109.0
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 安装fastapi失败
        pause
        exit /b 1
    )

    echo 安装 uvicorn...
    pip install "uvicorn[standard]>=0.27.0"
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 安装uvicorn失败
        pause
        exit /b 1
    )

    echo 安装 pydantic...
    pip install "pydantic>=2.0.0"
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 安装pydantic失败
        pause
        exit /b 1
    )

    echo 安装其他依赖...
    pip install "pydantic-settings>=2.0.0" "requests>=2.31.0" "python-multipart>=0.0.6"
    if %ERRORLEVEL% NEQ 0 (
        echo [警告] 部分依赖安装失败
    )
) else (
    echo [成功] 所有依赖安装完成
)
echo.

echo [验证] 检查关键依赖...
python -c "import fastapi; print(f'FastAPI: {fastapi.__version__}')" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] FastAPI导入失败
) else (
    echo [成功] FastAPI导入成功
)

python -c "import psycopg2; print(f'psycopg2: {psycopg2.__version__}')" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [警告] psycopg2导入失败（可能不影响使用）
) else (
    echo [成功] psycopg2导入成功
)

python -c "import pydantic; print(f'pydantic: {pydantic.__version__}')" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] pydantic导入失败
) else (
    echo [成功] pydantic导入成功
)
echo.

echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 如需运行AI服务，请执行:
echo   1. 激活虚拟环境: venv\Scriptsctivate.bat
echo   2. 启动服务: python app/main.py
echo.
echo 或直接运行:
echo   venv\Scripts\python.exe app/main.py
echo.
pause
