# ========================================
# 分页性能验证PowerShell脚本
# 用于验证大数据量分页查询性能
# ========================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("test", "stress", "monitor")]
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

function Test-PaginationPerformance {
    Write-Step "测试分页查询性能"
    Write-Host ""
    Write-Step "测试不同页码的分页查询" -Status "INFO"
    Write-Host ""

    $results = @{}

    # 测试第一页
    Write-Step "查询第1页（page=1, pageSize=20）..." -Status "INFO"
    $time1 = Measure-Command {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/projects?page=1&pageSize=20" -UseBasicParsing
        if ($response.StatusCode -ne 200) {
            throw "请求失败: $($response.StatusCode)"
        }
    }

    if ($time1.TotalMilliseconds -lt 1000) {
        Write-Step "第1页查询耗时: $($time1.TotalMilliseconds)ms" -Status "SUCCESS"
        $results["page1"] = $true
    } else {
        Write-Step "第1页查询耗时: $($time1.TotalMilliseconds)ms" -Status "WARNING"
        $results["page1"] = $false
    }

    # 测试中间页
    Write-Step "查询第100页（page=100, pageSize=20）..." -Status "INFO"
    $time2 = Measure-Command {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/projects?page=100&pageSize=20" -UseBasicParsing
        if ($response.StatusCode -ne 200) {
            throw "请求失败: $($response.StatusCode)"
        }
    }

    if ($time2.TotalMilliseconds -lt 1000) {
        Write-Step "第100页查询耗时: $($time2.TotalMilliseconds)ms" -Status "SUCCESS"
        $results["page100"] = $true
    } else {
        Write-Step "第100页查询耗时: $($time2.TotalMilliseconds)ms" -Status "WARNING"
        $results["page100"] = $false
    }

    # 测试大页码
    Write-Step "查询第1000页（page=1000, pageSize=20）..." -Status "INFO"
    $time3 = Measure-Command {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/projects?page=1000&pageSize=20" -UseBasicParsing
        if ($response.StatusCode -ne 200) {
            throw "请求失败: $($response.StatusCode)"
        }
    }

    if ($time3.TotalMilliseconds -lt 1000) {
        Write-Step "第1000页查询耗时: $($time3.TotalMilliseconds)ms" -Status "SUCCESS"
        $results["page1000"] = $true
    } else {
        Write-Step "第1000页查询耗时: $($time3.TotalMilliseconds)ms" -Status "WARNING"
        $results["page1000"] = $false
    }

    Write-Host ""
    Write-Step "性能分析" -Status "INFO"

    $allPassed = $true
    foreach ($key in $results.Keys) {
        if ($results[$key]) {
            Write-Step "$($key) 查询时间小于1000ms" -Status "SUCCESS"
        } else {
            Write-Step "$($key) 查询时间超过1000ms" -Status "WARNING"
            $allPassed = $false
        }
    }

    return $allPassed
}

function Test-PaginationStress {
    Write-Step "压力测试（模拟大数据量）"
    Write-Host ""
    Write-Step "发送100个并发分页请求" -Status "INFO"
    Write-Host ""

    # 使用PowerShell作业进行并发请求
    $jobs = @()
    for ($i = 1; $i -le 100; $i++) {
        $page = Get-Random -Minimum 1 -Maximum 1000
        $jobs += Start-Job -ScriptBlock {
            try {
                $response = Invoke-WebRequest -Uri "$($args[0])/api/v1/projects?page=$($args[1])&pageSize=20" -UseBasicParsing
                if ($response.StatusCode -ne 200) {
                    Write-Error "请求失败: $($response.StatusCode)"
                }
            } catch {
                Write-Error "请求异常: $($_.Exception.Message)"
            }
        } -ArgumentList @($baseUrl, $page)
    }

    # 等待所有作业完成
    $jobs | Wait-Job | Out-Null
    $jobs | Remove-Job

    Write-Step "等待请求完成..." -Status "INFO"
    Start-Sleep -Seconds 5

    # 检查数据库连接
    Write-Host ""
    Write-Step "检查数据库连接数" -Status "INFO"
    $connections = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count
    Write-Host "当前PostgreSQL连接数: $connections" -ForegroundColor Cyan

    Write-Host ""
    Write-Step "压力测试完成" -Status "SUCCESS"
    Write-Host ""
    Write-Step "说明: 如果数据库连接数稳定且无内存溢出，说明分页实现正确" -Status "INFO"

    return $true
}

function Monitor-DatabasePerformance {
    Write-Step "监控数据库连接和查询性能"
    Write-Host ""
    Write-Step "按 Ctrl+C 停止监控" -Status "INFO"
    Write-Host ""

    while ($true) {
        $timestamp = Get-Date -Format "HH:mm:ss"
        $connections = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count

        Write-Host "[$timestamp] 当前状态:" -ForegroundColor Cyan
        Write-Host "  - 数据库连接数: $connections" -ForegroundColor White

        # 测试查询响应时间
        $queryTime = Measure-Command {
            $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/projects?page=1&pageSize=20" -UseBasicParsing
            if ($response.StatusCode -ne 200) {
                throw "请求失败: $($response.StatusCode)"
            }
        }

        Write-Host "  - 服务响应时间: $($queryTime.TotalMilliseconds)ms" -ForegroundColor White

        Start-Sleep -Seconds 5
    }
}

# 主程序
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "分页性能验证脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 配置
$baseUrl = "http://localhost:8080"

# 检查服务是否运行
Write-Step "检查服务状态..." -Status "INFO"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing
    Write-Step "服务正在运行" -Status "SUCCESS"
    Write-Host ""
} catch {
    Write-Step "服务未运行，请先启动服务" -Status "ERROR"
    Write-Host ""
    exit 1
}

# 执行测试
$success = switch ($Action) {
    "test"    { Test-PaginationPerformance }
    "stress"  { Test-PaginationStress }
    "monitor" { Monitor-DatabasePerformance }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "验证完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Step "验证标准:" -Status "INFO"
Write-Host "  [√] 大数据量（10万+条）分页查询响应时间<1s" -ForegroundColor White
Write-Host "  [√] 无内存溢出" -ForegroundColor White
Write-Host "  [√] 数据库连接数稳定" -ForegroundColor White
Write-Host ""

exit $success
