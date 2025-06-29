const axios = require('axios');
const fs = require('fs');

// API 基础URL
const API_BASE_URL = 'http://localhost:5000/api/chart/render';

// 定义所有支持的图表类型和对应的测试数据
const chartTypes = {
  // 基础图表
  'line': {
    data: [
      { time: '2020', value: 100 },
      { time: '2021', value: 120 },
      { time: '2022', value: 140 },
      { time: '2023', value: 160 },
      { time: '2024', value: 180 }
    ],
    title: '折线图测试 - 年度销售趋势'
  },
  
  'area': {
    data: [
      { time: '一月', value: 30 },
      { time: '二月', value: 45 },
      { time: '三月', value: 55 },
      { time: '四月', value: 70 },
      { time: '五月', value: 85 }
    ],
    title: '面积图测试 - 月度访问量'
  },
  
  'column': {
    data: [
      { category: '产品A', value: 250 },
      { category: '产品B', value: 320 },
      { category: '产品C', value: 180 },
      { category: '产品D', value: 290 },
      { category: '产品E', value: 210 }
    ],
    title: '柱状图测试 - 产品销量对比'
  },
  
  'bar': {
    data: [
      { category: '北京', value: 150 },
      { category: '上海', value: 180 },
      { category: '广州', value: 120 },
      { category: '深圳', value: 160 },
      { category: '杭州', value: 140 }
    ],
    title: '条形图测试 - 城市销售额'
  },
  
  'pie': {
    data: [
      { category: 'Chrome', value: 65 },
      { category: 'Firefox', value: 15 },
      { category: 'Safari', value: 12 },
      { category: 'Edge', value: 8 }
    ],
    title: '饼图测试 - 浏览器市场份额'
  },
  
  'scatter': {
    data: [
      { x: 10, y: 20 },
      { x: 15, y: 25 },
      { x: 20, y: 30 },
      { x: 25, y: 28 },
      { x: 30, y: 35 },
      { x: 35, y: 40 }
    ],
    title: '散点图测试 - 身高体重关系'
  },
  
  // 高级图表
  'histogram': {
    data: [12, 19, 3, 5, 2, 3, 15, 8, 9, 12, 7, 14, 6, 11, 13, 9, 7, 8, 10, 15],
    title: '直方图测试 - 数据分布'
  },
  
  'boxplot': {
    data: [
      { category: '组A', values: [7, 8, 8, 9, 9, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15] },
      { category: '组B', values: [5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 13, 14, 15] },
      { category: '组C', values: [6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 15, 16] }
    ],
    title: '箱线图测试 - 分组数据分布'
  },
  
  'radar': {
    data: [
      {
        name: '产品A',
        values: [
          { dimension: '质量', value: 80 },
          { dimension: '价格', value: 70 },
          { dimension: '服务', value: 90 },
          { dimension: '品牌', value: 85 },
          { dimension: '创新', value: 75 }
        ]
      },
      {
        name: '产品B',
        values: [
          { dimension: '质量', value: 75 },
          { dimension: '价格', value: 85 },
          { dimension: '服务', value: 80 },
          { dimension: '品牌', value: 70 },
          { dimension: '创新', value: 80 }
        ]
      }
    ],
    title: '雷达图测试 - 产品综合评价'
  },
  
  'funnel': {
    data: [
      { stage: '访问', value: 1000 },
      { stage: '浏览', value: 800 },
      { stage: '加购', value: 600 },
      { stage: '下单', value: 400 },
      { stage: '支付', value: 300 }
    ],
    title: '漏斗图测试 - 用户转化漏斗'
  },
  
  'treemap': {
    data: {
      name: '公司',
      children: [
        {
          name: '技术部',
          children: [
            { name: '前端', value: 20 },
            { name: '后端', value: 30 },
            { name: '移动端', value: 15 }
          ]
        },
        {
          name: '产品部',
          children: [
            { name: '产品经理', value: 10 },
            { name: '设计师', value: 12 }
          ]
        },
        {
          name: '运营部',
          children: [
            { name: '市场', value: 8 },
            { name: '客服', value: 6 }
          ]
        }
      ]
    },
    title: '树状图测试 - 组织结构'
  },
  
  'sankey': {
    data: {
      nodes: [
        { id: 'A', name: '来源A' },
        { id: 'B', name: '来源B' },
        { id: 'C', name: '中转' },
        { id: 'D', name: '目标1' },
        { id: 'E', name: '目标2' }
      ],
      links: [
        { source: 'A', target: 'C', value: 30 },
        { source: 'B', target: 'C', value: 20 },
        { source: 'C', target: 'D', value: 25 },
        { source: 'C', target: 'E', value: 25 }
      ]
    },
    title: '桑基图测试 - 流量流向'
  },
  
  'word-cloud': {
    data: [
      { text: 'JavaScript', value: 100 },
      { text: 'TypeScript', value: 80 },
      { text: 'React', value: 75 },
      { text: 'Vue', value: 70 },
      { text: 'Node.js', value: 65 },
      { text: 'Python', value: 60 },
      { text: 'Java', value: 55 },
      { text: 'HTML', value: 50 },
      { text: 'CSS', value: 45 },
      { text: 'Angular', value: 40 }
    ],
    title: '词云图测试 - 技术热度'
  },
  
  'dual-axes': {
    data: {
      categories: ['一月', '二月', '三月', '四月', '五月'],
      series: [
        {
          name: '销售额',
          type: 'column',
          yAxis: 0,
          data: [120, 135, 101, 134, 90]
        },
        {
          name: '增长率',
          type: 'line',
          yAxis: 1,
          data: [10, 12, -5, 15, -8]
        }
      ]
    },
    title: '双轴图测试 - 销售额与增长率'
  },
  
  'liquid': {
    data: [{ value: 0.65 }],
    title: '水波图测试 - 完成进度 65%'
  },
  
  'violin': {
    data: [
      {
        category: '组A',
        values: [7, 8, 8, 9, 9, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15]
      },
      {
        category: '组B', 
        values: [5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 13, 14, 15]
      }
    ],
    title: '小提琴图测试 - 数据分布密度'
  },
  
  'venn': {
    data: [
      { sets: ['A'], size: 12, label: '集合A' },
      { sets: ['B'], size: 12, label: '集合B' },
      { sets: ['A', 'B'], size: 2, label: '交集' }
    ],
    title: '韦恩图测试 - 集合关系'
  },
  
  // 关系图表
  'mind-map': {
    data: {
      name: '项目管理',
      children: [
        {
          name: '计划阶段',
          children: [
            { name: '需求分析' },
            { name: '资源规划' },
            { name: '时间安排' }
          ]
        },
        {
          name: '执行阶段',
          children: [
            { name: '任务分配' },
            { name: '进度跟踪' },
            { name: '质量控制' }
          ]
        },
        {
          name: '收尾阶段',
          children: [
            { name: '成果验收' },
            { name: '经验总结' }
          ]
        }
      ]
    },
    title: '思维导图测试 - 项目管理流程'
  },
  
  'organization-chart': {
    data: {
      name: 'CEO',
      children: [
        {
          name: 'CTO',
          children: [
            { name: '前端团队' },
            { name: '后端团队' },
            { name: '运维团队' }
          ]
        },
        {
          name: 'COO',
          children: [
            { name: '产品团队' },
            { name: '运营团队' }
          ]
        }
      ]
    },
    title: '组织架构图测试 - 公司结构'
  },
  
  'flow-diagram': {
    data: {
      nodes: [
        { id: '1', label: '开始', type: 'start' },
        { id: '2', label: '输入数据', type: 'process' },
        { id: '3', label: '数据验证', type: 'decision' },
        { id: '4', label: '处理数据', type: 'process' },
        { id: '5', label: '输出结果', type: 'process' },
        { id: '6', label: '结束', type: 'end' }
      ],
      edges: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
        { source: '3', target: '4' },
        { source: '4', target: '5' },
        { source: '5', target: '6' }
      ]
    },
    title: '流程图测试 - 数据处理流程'
  },
  
  'fishbone-diagram': {
    data: {
      problem: '网站访问慢',
      categories: [
        {
          name: '服务器',
          causes: ['CPU占用高', '内存不足', '磁盘IO慢']
        },
        {
          name: '网络',
          causes: ['带宽不足', '延迟高', 'DNS解析慢']
        },
        {
          name: '代码',
          causes: ['算法效率低', '数据库查询慢', '缓存未命中']
        },
        {
          name: '用户端',
          causes: ['浏览器兼容性', '网络环境差', '设备性能低']
        }
      ]
    },
    title: '鱼骨图测试 - 问题根因分析'
  },
  
  'network-graph': {
    data: {
      nodes: [
        { id: '1', label: '用户A', type: 'user' },
        { id: '2', label: '用户B', type: 'user' },
        { id: '3', label: '用户C', type: 'user' },
        { id: '4', label: '群组1', type: 'group' },
        { id: '5', label: '群组2', type: 'group' }
      ],
      links: [
        { source: '1', target: '4', value: 5 },
        { source: '2', target: '4', value: 3 },
        { source: '2', target: '5', value: 4 },
        { source: '3', target: '5', value: 2 },
        { source: '1', target: '2', value: 1 }
      ]
    },
    title: '网络图测试 - 社交网络关系'
  }
};

// 测试结果存储
const testResults = [];

// 测试单个图表类型
async function testChartType(type, config) {
  try {
    console.log(`🧪 测试图表类型: ${type}`);
    
    const requestData = {
      type: type,
      data: config.data,
      title: config.title,
      width: 800,
      height: 600,
      theme: 'default'
    };
    
    const startTime = Date.now();
    
    const response = await axios.post(API_BASE_URL, requestData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30秒超时
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (response.status === 200 || response.status === 201) {
      console.log(`✅ ${type} - 成功 (${duration}ms)`);
      console.log(`   📷 图片URL: ${response.data.url}`);
      console.log(`   📁 文件名: ${response.data.filename}`);
      
      testResults.push({
        type: type,
        status: 'success',
        duration: duration,
        url: response.data.url,
        filename: response.data.filename,
        title: config.title
      });
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
  } catch (error) {
    console.log(`❌ ${type} - 失败`);
    console.log(`   错误: ${error.message}`);
    if (error.response) {
      console.log(`   响应状态: ${error.response.status}`);
      console.log(`   响应数据: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    
    testResults.push({
      type: type,
      status: 'failed',
      error: error.message,
      title: config.title
    });
  }
}

// 主测试函数
async function runAllTests() {
  console.log('🚀 开始测试所有图表类型...\n');
  console.log(`📡 API地址: ${API_BASE_URL}\n`);
  
  const startTime = Date.now();
  
  // 并发测试，但限制并发数量避免服务器压力过大
  const BATCH_SIZE = 3;
  const chartEntries = Object.entries(chartTypes);
  
  for (let i = 0; i < chartEntries.length; i += BATCH_SIZE) {
    const batch = chartEntries.slice(i, i + BATCH_SIZE);
    const promises = batch.map(([type, config]) => testChartType(type, config));
    
    await Promise.all(promises);
    
    // 批次间稍作延迟
    if (i + BATCH_SIZE < chartEntries.length) {
      console.log('⏳ 等待 2 秒后继续下一批...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // 生成测试报告
  console.log('\n📊 测试报告');
  console.log('='.repeat(60));
  
  const successfulTests = testResults.filter(r => r.status === 'success');
  const failedTests = testResults.filter(r => r.status === 'failed');
  
  console.log(`✅ 成功: ${successfulTests.length}/${testResults.length}`);
  console.log(`❌ 失败: ${failedTests.length}/${testResults.length}`);
  console.log(`⏱️  总耗时: ${(totalDuration / 1000).toFixed(2)} 秒`);
  
  if (successfulTests.length > 0) {
    console.log('\n🎉 成功的图表类型:');
    successfulTests.forEach(result => {
      console.log(`   • ${result.type}: ${result.title} (${result.duration}ms)`);
    });
  }
  
  if (failedTests.length > 0) {
    console.log('\n💥 失败的图表类型:');
    failedTests.forEach(result => {
      console.log(`   • ${result.type}: ${result.error}`);
    });
  }
  
  // 保存详细结果到文件
  const reportData = {
    summary: {
      total: testResults.length,
      successful: successfulTests.length,
      failed: failedTests.length,
      totalDuration: totalDuration,
      timestamp: new Date().toISOString()
    },
    results: testResults
  };
  
  const filename = `chart-render-test-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  fs.writeFileSync(filename, JSON.stringify(reportData, null, 2));
  console.log(`\n📄 详细报告已保存至: ${filename}`);
  
  // 生成HTML报告
  generateHTMLReport(reportData, filename.replace('.json', '.html'));
}

// 生成HTML测试报告
function generateHTMLReport(reportData, filename) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图表渲染测试报告</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; font-size: 2em; }
        .summary-card p { margin: 0; opacity: 0.9; }
        .results { display: grid; gap: 20px; }
        .result-item { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .result-item.success { border-left: 5px solid #27ae60; background-color: #f8fff9; }
        .result-item.failed { border-left: 5px solid #e74c3c; background-color: #fff8f8; }
        .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .result-type { font-weight: bold; font-size: 1.2em; color: #2c3e50; }
        .result-status.success { color: #27ae60; }
        .result-status.failed { color: #e74c3c; }
        .result-title { color: #7f8c8d; margin-bottom: 10px; }
        .result-details { font-size: 0.9em; color: #666; }
        .chart-preview { margin-top: 15px; }
        .chart-preview img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; }
        .error-message { background-color: #fee; padding: 10px; border-radius: 4px; color: #c62828; font-family: monospace; }
        .timestamp { text-align: center; color: #7f8c8d; margin-top: 30px; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 图表渲染测试报告</h1>
        
        <div class="summary">
            <div class="summary-card">
                <h3>${reportData.summary.total}</h3>
                <p>总测试数</p>
            </div>
            <div class="summary-card">
                <h3>${reportData.summary.successful}</h3>
                <p>成功</p>
            </div>
            <div class="summary-card">
                <h3>${reportData.summary.failed}</h3>
                <p>失败</p>
            </div>
            <div class="summary-card">
                <h3>${(reportData.summary.totalDuration / 1000).toFixed(1)}s</h3>
                <p>总耗时</p>
            </div>
        </div>
        
        <div class="results">
            ${reportData.results.map(result => `
                <div class="result-item ${result.status}">
                    <div class="result-header">
                        <span class="result-type">${result.type}</span>
                        <span class="result-status ${result.status}">
                            ${result.status === 'success' ? '✅ 成功' : '❌ 失败'}
                        </span>
                    </div>
                    <div class="result-title">${result.title}</div>
                    <div class="result-details">
                        ${result.status === 'success' ? `
                            <p><strong>渲染时间:</strong> ${result.duration}ms</p>
                            <p><strong>文件名:</strong> ${result.filename}</p>
                            <p><strong>访问URL:</strong> <a href="${result.url}" target="_blank">${result.url}</a></p>
                            <div class="chart-preview">
                                <img src="${result.url}" alt="Chart Preview" loading="lazy" onerror="this.style.display='none'">
                            </div>
                        ` : `
                            <div class="error-message">${result.error}</div>
                        `}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="timestamp">
            报告生成时间: ${new Date(reportData.summary.timestamp).toLocaleString('zh-CN')}
        </div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(filename, html);
  console.log(`🌐 HTML报告已保存至: ${filename}`);
}

// 运行测试
runAllTests().catch(console.error);
