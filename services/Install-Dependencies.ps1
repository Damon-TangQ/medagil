# ========================================
# 依赖安装PowerShell脚本
# 用于自动安装Go和Python项目的依赖
# ========================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("all", "go", "python")]
    [string]$Target = "all"
)

function Write-Step {
    param(
        [string]$Message,
        [string]$Status = "INFO"
    )

    $color = switch ($Status) {
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR"   { "Red" }
        default   { "Cyan" }
    }

    Write-Host "[$Status] $Message" -ForegroundColor $color
}

function Install-GoDependencies {
    Write-Step "开始安装Go依赖..."
    Write-Host ""

    # 检查Go是否安装
    $goCmd = Get-Command go -ErrorAction SilentlyContinue
    if (-not $goCmd) {
        Write-Step "未找到Go，请先安装Go 1.21或更高版本" -Status "ERROR"
        Write-Step "下载地址: https://golang.org/dl/" -Status "INFO"
        return $false
    }

    # 显示Go版本
    $goVersion = go version
    Write-Step "Go版本: $goVersion" -Status "INFO"
    Write-Host ""

    # 配置Go代理
    Write-Step "配置Go代理（中国大陆用户）..." -Status "INFO"
    $proxyResult = go env -w GOPROXY=https://goproxy.cn,direct
    if ($LASTEXITCODE -eq 0) {
        Write-Step "Go代理已配置为: https://goproxy.cn,direct" -Status "SUCCESS"
    } else {
        Write-Step "配置Go代理失败，将使用默认代理" -Status "WARNING"
    }
    Write-Host ""

    # 进入api-service目录
    Write-Step "进入api-service目录..." -Status "INFO"
    $apiServicePath = Join-Path $PSScriptRoot "api-service"
    if (-not (Test-Path $apiServicePath)) {
        Write-Step "无法找到api-service目录: $apiServicePath" -Status "ERROR"
        return $false
    }
    Set-Location $apiServicePath
    Write-Step "当前目录: $PWD" -Status "SUCCESS"
    Write-Host ""

    # 安装Go依赖
    Write-Step "安装Go依赖..." -Status "INFO"

    Write-Step "运行 go mod tidy..." -Status "INFO"
    go mod tidy
    if ($LASTEXITCODE -ne 0) {
        Write-Step "go mod tidy 失败" -Status "ERROR"
        return $false
    }
    Write-Step "go mod tidy 完成" -Status "SUCCESS"
    Write-Host ""

    Write-Step "运行 go mod download..." -Status "INFO"
    go mod download
    if ($LASTEXITCODE -ne 0) {
        Write-Step "go mod download 失败" -Status "ERROR"
        return $false
    }
    Write-Step "go mod download 完成" -Status "SUCCESS"
    Write-Host ""

    Write-Step "运行 go mod verify..." -Status "INFO"
    go mod verify
    if ($LASTEXITCODE -ne 0) {
        Write-Step "go mod verify 失败，但可能不影响使用" -Status "WARNING"
    } else {
        Write-Step "go mod verify 完成" -Status "SUCCESS"
    }
    Write-Host ""

    # 编译项目
    Write-Step "编译项目..." -Status "INFO"
    $binDir = Join-Path $apiServicePath "bin"
    if (-not (Test-Path $binDir)) {
        New-Item -ItemType Directory -Path $binDir | Out-Null
    }

    $serverExe = Join-Path $binDir "server.exe"
    go build -o $serverExe ./cmd/server
    if ($LASTEXITCODE -ne 0) {
        Write-Step "项目编译失败" -Status "ERROR"
        return $false
    }
    Write-Step "项目编译完成，可执行文件: $serverExe" -Status "SUCCESS"
    Write-Host ""

    return $true
}

function Install-PythonDependencies {
    Write-Step "开始安装Python依赖..."
    Write-Host ""

    # 检查Python是否安装
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pythonCmd) {
        Write-Step "未找到Python，请先安装Python 3.10或更高版本" -Status "ERROR"
        Write-Step "下载地址: https://www.python.org/downloads/" -Status "INFO"
        return $false
    }

    # 显示Python版本
    $pythonVersion = python --version 2>&1
    Write-Step "Python版本: $pythonVersion" -Status "INFO"
    Write-Host ""

    # 进入ai-service目录
    Write-Step "进入ai-service目录..." -Status "INFO"
    $aiServicePath = Join-Path $PSScriptRoot "ai-service"
    if (-not (Test-Path $aiServicePath)) {
        Write-Step "无法找到ai-service目录: $aiServicePath" -Status "ERROR"
        return $false
    }
    Set-Location $aiServicePath
    Write-Step "当前目录: $PWD" -Status "SUCCESS"
    Write-Host ""

    # 创建虚拟环境
    Write-Step "创建虚拟环境..." -Status "INFO"
    $venvPath = Join-Path $aiServicePath "venv"
    if (Test-Path $venvPath) {
        Write-Step "虚拟环境已存在，跳过创建" -Status "WARNING"
    } else {
        python -m venv venv
        if ($LASTEXITCODE -ne 0) {
            Write-Step "创建虚拟环境失败" -Status "ERROR"
            return $false
        }
        Write-Step "虚拟环境创建成功" -Status "SUCCESS"
    }
    Write-Host ""

    # 激活虚拟环境
    Write-Step "激活虚拟环境..." -Status "INFO"
    $activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
    if (-not (Test-Path $activateScript)) {
        Write-Step "无法找到激活脚本: $activateScript" -Status "ERROR"
        return $false
    }
    & $activateScript
    Write-Step "虚拟环境已激活" -Status "SUCCESS"
    Write-Host ""

    # 升级pip
    Write-Step "升级pip..." -Status "INFO"
    python -m pip install --upgrade pip
    if ($LASTEXITCODE -ne 0) {
        Write-Step "升级pip失败，将继续安装依赖" -Status "WARNING"
    } else {
        Write-Step "pip已升级" -Status "SUCCESS"
    }
    Write-Host ""

    # 安装依赖
    Write-Step "安装项目依赖..." -Status "INFO"

    Write-Step "尝试使用 pip install -e . 安装..." -Status "INFO"
    pip install -e .
    if ($LASTEXITCODE -ne 0) {
        Write-Step "pip install -e . 失败，将手动安装核心依赖" -Status "WARNING"
        Write-Host ""

        Write-Step "手动安装核心依赖..." -Status "INFO"

        $packages = @(
            "psycopg2-binary==2.9.9",
            "fastapi==0.109.0",
            "uvicorn[standard]>=0.27.0",
            "pydantic>=2.0.0",
            "pydantic-settings>=2.0.0",
            "requests>=2.31.0",
            "python-multipart>=0.0.6"
        )

        foreach ($package in $packages) {
            Write-Step "安装 $package..." -Status "INFO"
            pip install $package
            if ($LASTEXITCODE -ne 0) {
                Write-Step "安装 $package 失败" -Status "ERROR"
                return $false
            }
        }
    } else {
        Write-Step "所有依赖安装完成" -Status "SUCCESS"
    }
    Write-Host ""

    # 验证依赖
    Write-Step "验证关键依赖..." -Status "INFO"

    $dependencies = @{
        "fastapi" = "FastAPI"
        "psycopg2" = "psycopg2"
        "pydantic" = "pydantic"
    }

    foreach ($dep in $dependencies.GetEnumerator()) {
        $result = python -c "import $($dep.Key); print(f'$($dep.Value): {$($dep.Key).__version__}')" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Step $result -Status "SUCCESS"
        } else {
            $status = if ($dep.Key -eq "psycopg2") { "WARNING" } else { "ERROR" }
            Write-Step "$($dep.Value)导入失败" -Status $status
        }
    }
    Write-Host ""

    return $true
}

# 主程序
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "依赖安装脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$success = $true

switch ($Target) {
    "all" {
        $success = Install-GoDependencies
        if ($success) {
            $success = Install-PythonDependencies
        }
    }
    "go" {
        $success = Install-GoDependencies
    }
    "python" {
        $success = Install-PythonDependencies
    }
}

Write-Host ""
if ($success) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "安装完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""

    if ($Target -eq "all" -or $Target -eq "go") {
        Write-Host "Go服务可执行文件: $(Join-Path $PSScriptRoot 'api-servicein\server.exe')" -ForegroundColor Cyan
    }

    if ($Target -eq "all" -or $Target -eq "python") {
        Write-Host "启动AI服务:" -ForegroundColor Cyan
        Write-Host "  1. 激活虚拟环境: venv\Scripts\Activate.ps1" -ForegroundColor White
        Write-Host "  2. 启动服务: python app\main.py" -ForegroundColor White
    }
    Write-Host ""
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "安装失败，请检查错误信息" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
}

exit $success
