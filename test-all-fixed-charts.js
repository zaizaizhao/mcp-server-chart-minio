const fs = require('fs');

// 测试数据配置
const testConfigs = {
  // 基础图表
  line: {
    data: [
      { time: '2020', value: 100 },
      { time: '2021', value: 120 },
      { time: '2022', value: 140 },
      { time: '2023', value: 160 },
      { time: '2024', value: 180 }
    ]
  },
  area: {
    data: [
      { time: '2020', value: 100 },
      { time: '2021', value: 120 },
      { time: '2022', value: 140 },
      { time: '2023', value: 160 },
      { time: '2024', value: 180 }
    ]
  },
  column: {
    data: [
      { category: 'Sports', value: 275 },
      { category: 'Strategy', value: 115 },
      { category: 'Action', value: 120 },
      { category: 'Shooter', value: 350 },
      { category: 'Other', value: 150 }
    ]
  },
  bar: {
    data: [
      { category: 'Product A', value: 100 },
      { category: 'Product B', value: 200 },
      { category: 'Product C', value: 150 },
      { category: 'Product D', value: 300 }
    ]
  },
  pie: {
    data: [
      { category: '分类一', value: 27 },
      { category: '分类二', value: 25 },
      { category: '分类三', value: 18 },
      { category: '分类四', value: 15 },
      { category: '其他', value: 15 }
    ]
  },
  scatter: {
    data: [
      { x: 161.2, y: 51.6 },
      { x: 167.5, y: 59 },
      { x: 159.5, y: 49.2 },
      { x: 157, y: 63 },
      { x: 155.8, y: 53.6 }
    ]
  },
  
  // 高级图表
  histogram: {
    data: [12, 19, 25, 32, 45, 67, 89, 23, 56, 78]
  },
  boxplot: {
    data: [
      { category: 'Category 1', min: 10, q1: 20, median: 30, q3: 40, max: 50 },
      { category: 'Category 2', min: 15, q1: 25, median: 35, q3: 45, max: 55 }
    ]
  },
  radar: {
    data: [
      { name: 'Item 1', category: 'Speed', value: 80 },
      { name: 'Item 1', category: 'Power', value: 90 },
      { name: 'Item 1', category: 'Defense', value: 70 },
      { name: 'Item 2', category: 'Speed', value: 70 },
      { name: 'Item 2', category: 'Power', value: 85 },
      { name: 'Item 2', category: 'Defense', value: 95 }
    ]
  },
  funnel: {
    data: [
      { stage: 'Awareness', value: 1000 },
      { stage: 'Interest', value: 800 },
      { stage: 'Consideration', value: 600 },
      { stage: 'Purchase', value: 300 }
    ]
  },
  treemap: {
    data: [
      { name: 'Category A', value: 100 },
      { name: 'Category B', value: 200 },
      { name: 'Category C', value: 150 },
      { name: 'Category D', value: 300 }
    ]
  },
  sankey: {
    data: [
      { source: 'A', target: 'X', value: 10 },
      { source: 'A', target: 'Y', value: 15 },
      { source: 'B', target: 'X', value: 20 },
      { source: 'B', target: 'Z', value: 25 }
    ]
  },
  'word-cloud': {
    data: [
      { text: 'JavaScript', value: 100 },
      { text: 'React', value: 80 },
      { text: 'Vue', value: 70 },
      { text: 'Angular', value: 60 },
      { text: 'Node.js', value: 90 }
    ]
  },
  'dual-axes': {
    data: [
      { time: '2020', sales: 100, profit: 20 },
      { time: '2021', sales: 120, profit: 25 },
      { time: '2022', sales: 140, profit: 30 },
      { time: '2023', sales: 160, profit: 35 },
      { time: '2024', sales: 180, profit: 40 }
    ]
  },
  liquid: {
    data: [{ percent: 0.75 }]
  },
  violin: {
    data: [
      { category: 'Group A', value: 75 },
      { category: 'Group B', value: 85 },
      { category: 'Group C', value: 65 }
    ]
  },
  venn: {
    data: [
      { sets: ['A'], size: 10 },
      { sets: ['B'], size: 8 },
      { sets: ['A', 'B'], size: 3 }
    ]
  },
  
  // 关系图表
  'mind-map': {
    data: [
      { name: 'Central Topic' },
      { name: 'Branch 1' },
      { name: 'Branch 2' },
      { name: 'Branch 3' }
    ]
  },
  'organization-chart': {
    data: [
      { name: 'CEO', description: 'Chief Executive Officer' },
      { name: 'CTO', description: 'Chief Technology Officer' },
      { name: 'CFO', description: 'Chief Financial Officer' }
    ]
  },
  'flow-diagram': {
    data: [
      { name: 'Start', type: 'start' },
      { name: 'Process', type: 'process' },
      { name: 'Decision', type: 'decision' },
      { name: 'End', type: 'end' }
    ]
  },
  'fishbone-diagram': {
    data: [
      { name: 'Quality Problem' },
      { name: 'People' },
      { name: 'Process' },
      { name: 'Technology' }
    ]
  },
  'network-graph': {
    data: [
      { name: 'Node 1', group: 'group1' },
      { name: 'Node 2', group: 'group1' },
      { name: 'Node 3', group: 'group2' },
      { name: 'Node 4', group: 'group2' }
    ]
  }
};

// 测试函数
async function testChart(chartType, config) {
  const url = `http://localhost:3000/api/chart-generators/${chartType}`;
  const payload = {
    ...config,
    title: `Test ${chartType} Chart`,
    width: 800,
    height: 600
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ ${chartType}: SUCCESS - ${result.url}`);
      return { chartType, status: 'success', url: result.url, filename: result.filename };
    } else {
      const error = await response.text();
      console.log(`❌ ${chartType}: FAILED - ${response.status} ${error}`);
      return { chartType, status: 'failed', error: `${response.status} ${error}` };
    }
  } catch (error) {
    console.log(`💥 ${chartType}: ERROR - ${error.message}`);
    return { chartType, status: 'error', error: error.message };
  }
}

// 主测试函数
async function runAllTests() {
  console.log('🚀 开始测试所有图表接口...\n');
  
  const results = [];
  const chartTypes = Object.keys(testConfigs);
  
  for (const chartType of chartTypes) {
    const config = testConfigs[chartType];
    const result = await testChart(chartType, config);
    results.push(result);
    
    // 短暂延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 统计结果
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  const errors = results.filter(r => r.status === 'error');
  
  console.log('\n📊 测试结果统计:');
  console.log(`✅ 成功: ${successful.length}/${results.length}`);
  console.log(`❌ 失败: ${failed.length}/${results.length}`);
  console.log(`💥 错误: ${errors.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ 成功的接口:');
    successful.forEach(r => console.log(`  - ${r.chartType}`));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ 失败的接口:');
    failed.forEach(r => console.log(`  - ${r.chartType}: ${r.error}`));
  }
  
  if (errors.length > 0) {
    console.log('\n💥 错误的接口:');
    errors.forEach(r => console.log(`  - ${r.chartType}: ${r.error}`));
  }
  
  // 保存详细结果到文件
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = `test-results-${timestamp}.json`;
  fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
  console.log(`\n📄 详细结果已保存到: ${reportFile}`);
  
  return results;
}

// 运行测试
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testConfigs, testChart, runAllTests };
