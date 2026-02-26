# ========================================
# AI路由验证PowerShell脚本
# 用于验证/api/v1/ai/process接口功能
# ========================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("test", "valid", "invalid", "missing", "types")]
    [string]$Action = "test"
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

function Test-ValidRequest {
    Write-Step "测试场景1: 有效请求（论文大纲生成）"
    Write-Host ""
    Write-Step "发送有效的AI处理请求" -Status "INFO"
    Write-Host ""

    $body = @{
        input_text = "人工智能在医疗诊断中的应用研究"
        agent_type = "paper-outline"
        parameters = @{}
    } | ConvertTo-Json

    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/ai/process" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing

        Write-Step "HTTP状态码: $($response.StatusCode)" -Status "INFO"
        Write-Step "响应时间: $($response.RawResponseMetadata.TotalMilliseconds)ms" -Status "INFO"
        Write-Host "响应内容:" -ForegroundColor Gray
        Write-Host $response.Content -ForegroundColor Gray

        if ($response.StatusCode -eq 200) {
            Write-Step "有效请求返回200状态码" -Status "SUCCESS"
            return $true
        } else {
            Write-Step "有效请求未返回200状态码" -Status "ERROR"
            return $false
        }
    } catch {
        Write-Step "请求失败: $($_.Exception.Message)" -Status "ERROR"
        return $false
    }
}

function Test-InvalidAgentType {
    Write-Step "测试场景2: 无效agent_type"
    Write-Host ""
    Write-Step "发送包含无效agent_type的请求" -Status "INFO"
    Write-Host ""

    $body = @{
        input_text = "测试文本"
        agent_type = "invalid_type"
        parameters = @{}
    } | ConvertTo-Json

    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/ai/process" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing

        Write-Step "HTTP状态码: $($response.StatusCode)" -Status "INFO"
        Write-Host "响应内容:" -ForegroundColor Gray
        Write-Host $response.Content -ForegroundColor Gray

        if ($response.StatusCode -eq 400) {
            Write-Step "无效agent_type返回400状态码" -Status "SUCCESS"
            return $true
        } else {
            Write-Step "无效agent_type未被正确拒绝" -Status "ERROR"
            return $false
        }
    } catch {
        Write-Step "请求失败: $($_.Exception.Message)" -Status "ERROR"
        return $false
    }
}

function Test-MissingInputText {
    Write-Step "测试场景3: 缺失input_text"
    Write-Host ""
    Write-Step "发送缺失input_text的请求" -Status "INFO"
    Write-Host ""

    $body = @{
        agent_type = "general"
        parameters = @{}
    } | ConvertTo-Json

    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/ai/process" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing

        Write-Step "HTTP状态码: $($response.StatusCode)" -Status "INFO"
        Write-Host "响应内容:" -ForegroundColor Gray
        Write-Host $response.Content -ForegroundColor Gray

        if ($response.StatusCode -eq 400) {
            Write-Step "缺失input_text返回400状态码" -Status "SUCCESS"
            return $true
        } else {
            Write-Step "缺失input_text未被正确拒绝" -Status "ERROR"
            return $false
        }
    } catch {
        Write-Step "请求失败: $($_.Exception.Message)" -Status "ERROR"
        return $false
    }
}

function Test-AllAgentTypes {
    Write-Step "测试场景4: 所有支持的agent_type"
    Write-Host ""

    $types = @(
        @{ name = "paper-outline"; desc = "论文大纲生成" },
        @{ name = "paper-polish"; desc = "论文润色" },
        @{ name = "paper-review"; desc = "论文评审" },
        @{ name = "general"; desc = "通用AI处理" }
    )

    $allPassed = $true
    foreach ($type in $types) {
        Write-Step "测试 $($type.desc) ($($type.name))" -Status "INFO"

        $body = @{
            input_text = "测试文本"
            agent_type = $type.name
            parameters = @{}
        } | ConvertTo-Json

        try {
            $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/ai/process" `
                -Method POST `
                -ContentType "application/json" `
                -Body $body `
                -UseBasicParsing

            if ($response.StatusCode -eq 200) {
                Write-Step "$($type.name)处理成功" -Status "SUCCESS"
            } else {
                Write-Step "$($type.name)处理失败（状态码: $($response.StatusCode））" -Status "ERROR"
                $allPassed = $false
            }
        } catch {
            Write-Step "$($type.name)处理失败: $($_.Exception.Message)" -Status "ERROR"
            $allPassed = $false
        }
    }

    return $allPassed
}

# 主程序
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AI路由验证脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 配置
$baseUrl = "http://localhost:8000"

# 检查服务是否运行
Write-Step "检查服务状态..." -Status "INFO"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing
    Write-Step "服务正在运行" -Status "SUCCESS"
    Write-Host ""
} catch {
    Write-Step "服务未运行，请先启动服务" -Status "ERROR"
    Write-Host ""
    Write-Step "启动服务:" -Status "INFO"
    Write-Host "  cd ai-service" -ForegroundColor White
    Write-Host "  python app\main.py" -ForegroundColor White
    Write-Host ""
    exit 1
}

# 执行测试
$results = @()

if ($Action -eq "test" -or $Action -eq "valid") {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $results += Test-ValidRequest
}

if ($Action -eq "test" -or $Action -eq "invalid") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $results += Test-InvalidAgentType
}

if ($Action -eq "test" -or $Action -eq "missing") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $results += Test-MissingInputText
}

if ($Action -eq "test" -or $Action -eq "types") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $results += Test-AllAgentTypes
}

# 显示结果
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "验证完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Step "验证标准:" -Status "INFO"
Write-Host "  [√] POST请求/api/v1/ai/process可正常返回响应" -ForegroundColor White
Write-Host "  [√] 有效请求返回200状态码" -ForegroundColor White
Write-Host "  [√] 无效agent_type返回400状态码" -ForegroundColor White
Write-Host "  [√] 缺失input_text返回400状态码" -ForegroundColor White
Write-Host "  [√] 所有支持的agent_type都能正常处理" -ForegroundColor White
Write-Host ""

# 检查所有测试是否通过
$allPassed = $true
foreach ($result in $results) {
    if (-not $result) {
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Host "[成功] 所有测试通过！" -ForegroundColor Green
    exit 0
} else {
    Write-Host "[失败] 部分测试未通过" -ForegroundColor Red
    exit 1
}
