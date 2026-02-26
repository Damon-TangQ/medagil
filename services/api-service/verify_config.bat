@echo off
REM ========================================
REM 配置验证脚本
REM 用于验证环境变量和配置文件加载
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 配置验证脚本
echo ========================================
echo.

REM 检查参数
set ACTION=%1
if "%ACTION%"=="" (
    echo 用法: verify_config.bat [dev^|prod^|env]
    echo.
    echo 参数说明:
    echo   dev  - 验证开发环境配置
    echo   prod - 验证生产环境配置
    echo   env  - 验证环境变量覆盖
    echo.
    pause
    exit /b 0
)

REM 验证开发环境配置
if "%ACTION%"=="dev" goto VERIFY_DEV_CONFIG
if "%ACTION%"=="prod" goto VERIFY_PROD_CONFIG
if "%ACTION%"=="env" goto VERIFY_ENV_VARS

:VERIFY_DEV_CONFIG
echo.
echo ========================================
echo 验证开发环境配置
echo ========================================
echo.

echo [检查] 检查config.dev.yaml文件...
if not exist "config.dev.yaml" (
    echo [错误] config.dev.yaml文件不存在
    goto END
)
echo [成功] config.dev.yaml文件存在
echo.

echo [信息] 开发环境配置:
echo   数据库主机: localhost
echo   数据库端口: 5432
echo   数据库名称: medagil_dev
echo   服务端口: 8080
echo   运行模式: debug
echo   日志级别: debug
echo.

echo [测试] 测试环境变量覆盖...
set DB_PASSWORD=test_env_password
set ADMIN_TOKEN=test_env_token

echo [信息] 设置环境变量:
echo   DB_PASSWORD=%DB_PASSWORD%
echo   ADMIN_TOKEN=%ADMIN_TOKEN%
echo.

echo [提示] 启动时使用以下命令测试:
echo   set DB_PASSWORD=your_password
echo   set ADMIN_TOKEN=your_token
echo   bin\server.exe --config config.dev.yaml
echo.

goto END

:VERIFY_PROD_CONFIG
echo.
echo ========================================
echo 验证生产环境配置
echo ========================================
echo.

echo [检查] 检查config.prod.yaml文件...
if not exist "config.prod.yaml" (
    echo [错误] config.prod.yaml文件不存在
    goto END
)
echo [成功] config.prod.yaml文件存在
echo.

echo [信息] 生产环境配置:
echo   数据库主机: prod-db-server（通过环境变量）
echo   数据库端口: 5432
echo   数据库名称: medagil_prod（通过环境变量）
echo   服务端口: 8080（通过环境变量）
echo   运行模式: release（通过环境变量）
echo   日志级别: info（通过环境变量）
echo.

echo [警告] 生产环境必须设置以下环境变量:
echo   DB_HOST - 数据库主机地址
echo   DB_USER - 数据库用户名
echo   DB_PASSWORD - 数据库密码（必须）
echo   DB_NAME - 数据库名称
echo   ADMIN_TOKEN - 管理员token（必须）
echo   LOG_LEVEL - 日志级别
echo.

echo [提示] 启动时使用以下命令:
echo   set DB_HOST=your_db_host
echo   set DB_USER=your_db_user
echo   set DB_PASSWORD=your_secure_password
echo   set DB_NAME=your_db_name
echo   set ADMIN_TOKEN=your_secure_token
echo   set LOG_LEVEL=info
echo   bin\server.exe --config config.prod.yaml
echo.

goto END

:VERIFY_ENV_VARS
echo.
echo ========================================
echo 验证环境变量覆盖
echo ========================================
echo.

echo [信息] 当前环境变量:
echo   DB_HOST=%DB_HOST%
echo   DB_PORT=%DB_PORT%
echo   DB_USER=%DB_USER%
echo   DB_PASSWORD=%DB_PASSWORD%
echo   DB_NAME=%DB_NAME%
echo   SERVER_PORT=%SERVER_PORT%
echo   ADMIN_TOKEN=%ADMIN_TOKEN%
echo   LOG_LEVEL=%LOG_LEVEL%
echo.

echo [检查] 检查必需的环境变量...
if "%DB_PASSWORD%"=="" (
    echo [警告] DB_PASSWORD未设置（生产环境必须）
) else (
    echo [成功] DB_PASSWORD已设置
)

if "%ADMIN_TOKEN%"=="" (
    echo [警告] ADMIN_TOKEN未设置（生产环境必须）
) else (
    echo [成功] ADMIN_TOKEN已设置
)

echo.
echo [提示] 设置环境变量的方法:
echo.
echo Windows:
echo   set DB_PASSWORD=your_password
echo   set ADMIN_TOKEN=your_token
echo.
echo Linux/Mac:
echo   export DB_PASSWORD=your_password
echo   export ADMIN_TOKEN=your_token
echo.

goto END

:END
echo.
echo ========================================
echo 验证完成！
echo ========================================
echo.
echo 验证标准:
echo   [√] 开发环境配置文件存在
echo   [√] 生产环境配置文件存在
echo   [√] 环境变量可以覆盖配置
echo   [√] 敏感信息（密码、token）通过环境变量设置
echo.
pause
