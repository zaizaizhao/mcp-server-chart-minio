#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000/api/chart-generators';

// 测试数据配置
const testConfigs = {
  'area': {
    data: [
      { time: '2020', value: 100 },
      { time: '2021', value: 120 },
      { time: '2022', value: 140 },
      { time: '2023', value: 160 }
    ],
    title: 'Area Chart Test'
  },
  'line': {
    data: [
      { time: '2020', value: 100 },
      { time: '2021', value: 120 },
      { time: '2022', value: 140 },
      { time: '2023', value: 160 }
    ],
    title: 'Line Chart Test'
  },
  'column': {
    data: [
      { category: 'Q1', value: 125 },
      { category: 'Q2', value: 148 },
      { category: 'Q3', value: 162 },
      { category: 'Q4', value: 180 }
    ],
    title: 'Column Chart Test'
  },
  'bar': {
    data: [
      { category: 'Product A', value: 100 },
      { category: 'Product B', value: 200 },
      { category: 'Product C', value: 150 },
      { category: 'Product D', value: 300 }
    ],
    title: 'Bar Chart Test'
  },
  'pie': {
    data: [
      { category: 'A', value: 40 },
      { category: 'B', value: 30 },
      { category: 'C', value: 20 },
      { category: 'D', value: 10 }
    ],
    title: 'Pie Chart Test'
  },
  'scatter': {
    data: [
      { x: 161.2, y: 51.6 },
      { x: 167.5, y: 59 },
      { x: 159.5, y: 49.2 },
      { x: 157, y: 63 },
      { x: 155.8, y: 53.6 }
    ],
    title: 'Scatter Plot Test'
  },
  'boxplot': {
    data: [
      { category: 'Group A', min: 45, q1: 60, median: 75, q3: 85, max: 95 },
      { category: 'Group B', min: 50, q1: 65, median: 78, q3: 88, max: 98 },
      { category: 'Group C', min: 55, q1: 70, median: 80, q3: 90, max: 100 }
    ],
    title: 'Box Plot Test'
  },
  'histogram': {
    data: [
      { value: 10 },
      { value: 20 },
      { value: 30 },
      { value: 40 },
      { value: 50 }
    ],
    title: 'Histogram Test'
  },
  'radar': {
    data: [
      { category: 'Attack', value: 85 },
      { category: 'Defense', value: 78 },
      { category: 'Speed', value: 92 },
      { category: 'Magic', value: 67 }
    ],
    title: 'Radar Chart Test'
  },
  'funnel': {
    data: [
      { stage: 'Awareness', value: 1000 },
      { stage: 'Interest', value: 800 },
      { stage: 'Consideration', value: 600 },
      { stage: 'Purchase', value: 400 }
    ],
    title: 'Funnel Chart Test'
  },
  'treemap': {
    data: [
      { name: 'Category A', value: 100 },
      { name: 'Category B', value: 200 },
      { name: 'Category C', value: 150 },
      { name: 'Category D', value: 80 }
    ],
    title: 'Treemap Test'
  },
  'sankey': {
    data: [
      { source: 'A', target: 'X', value: 10 },
      { source: 'A', target: 'Y', value: 15 },
      { source: 'B', target: 'X', value: 20 },
      { source: 'B', target: 'Z', value: 12 }
    ],
    title: 'Sankey Diagram Test'
  },
  'word-cloud': {
    data: [
      { text: 'JavaScript', value: 100 },
      { text: 'Python', value: 80 },
      { text: 'Java', value: 90 },
      { text: 'TypeScript', value: 70 }
    ],
    title: 'Word Cloud Test'
  },
  'dual-axes': {
    data: [
      { time: '2020', value1: 100, value2: 50 },
      { time: '2021', value1: 120, value2: 60 },
      { time: '2022', value1: 140, value2: 70 },
      { time: '2023', value1: 160, value2: 80 }
    ],
    title: 'Dual Axes Test'
  },
  'liquid': {
    data: [{ percent: 0.75 }],
    title: 'Liquid Chart Test'
  },
  'violin': {
    data: [
      { category: 'Group A', value: 75 },
      { category: 'Group B', value: 82 },
      { category: 'Group C', value: 68 }
    ],
    title: 'Violin Plot Test'
  },
  'venn': {
    data: [
      { sets: ['A'], size: 100 },
      { sets: ['B'], size: 80 },
      { sets: ['A', 'B'], size: 30 }
    ],
    title: 'Venn Diagram Test'
  },
  'mind-map': {
    data: [
      { id: 'root', label: 'Main Topic' },
      { id: 'branch1', label: 'Branch 1', parent: 'root' },
      { id: 'branch2', label: 'Branch 2', parent: 'root' }
    ],
    title: 'Mind Map Test'
  },
  'organization-chart': {
    data: [
      { id: 'ceo', name: 'CEO' },
      { id: 'cto', name: 'CTO', parent: 'ceo' },
      { id: 'dev1', name: 'Developer 1', parent: 'cto' }
    ],
    title: 'Organization Chart Test'
  },
  'flow-diagram': {
    data: [
      { id: 'start', label: 'Start' },
      { id: 'process', label: 'Process' },
      { id: 'end', label: 'End' }
    ],
    title: 'Flow Diagram Test'
  },
  'fishbone-diagram': {
    data: [
      { id: 'cause1', label: 'Cause 1' },
      { id: 'cause2', label: 'Cause 2' },
      { id: 'cause3', label: 'Cause 3' }
    ],
    title: 'Fishbone Diagram Test'
  },
  'network-graph': {
    data: [
      { id: 'node1', label: 'Node 1' },
      { id: 'node2', label: 'Node 2' },
      { id: 'node3', label: 'Node 3' }
    ],
    title: 'Network Graph Test'
  },
  'district-map': {
    data: [
      { name: '北京', value: 2154 },
      { name: '上海', value: 2423 },
      { name: '广州', value: 1521 },
      { name: '深圳', value: 1876 }
    ],
    title: 'District Map Test'
  },
  'pin-map': {
    data: [
      { x: 116.4074, y: 39.9042, value: 100 },
      { x: 121.4737, y: 31.2304, value: 200 },
      { x: 113.2644, y: 23.1291, value: 150 }
    ],
    title: 'Pin Map Test'
  },
  'path-map': {
    data: [
      { time: '2020', value: 100 },
      { time: '2021', value: 120 },
      { time: '2022', value: 140 }
    ],
    title: 'Path Map Test'
  }
};

async function testChart(chartType, config) {
  try {
    console.log(`\n🧪 Testing ${chartType}...`);
    
    const response = await axios.post(`${BASE_URL}/${chartType}`, config, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 // 30秒超时
    });
    
    if (response.status === 200 || response.status === 201) {
      console.log(`✅ ${chartType}: SUCCESS`);
      console.log(`   📄 File: ${response.data.filename}`);
      console.log(`   🔗 URL: ${response.data.url.substring(0, 80)}...`);
      return { chartType, status: 'success', data: response.data };
    } else {
      console.log(`❌ ${chartType}: HTTP ${response.status}`);
      return { chartType, status: 'failed', error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log(`❌ ${chartType}: ERROR`);
    console.log(`   💥 ${error.message}`);
    return { chartType, status: 'failed', error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive chart API tests...\n');
  
  const results = [];
  const chartTypes = Object.keys(testConfigs);
  
  for (const chartType of chartTypes) {
    const config = testConfigs[chartType];
    const result = await testChart(chartType, config);
    results.push(result);
    
    // 延迟避免过快请求
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 统计结果
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  
  console.log('\n📊 测试结果统计:');
  console.log(`=================================`);
  console.log(`总图表数: ${results.length}`);
  console.log(`成功数: ${successful.length}`);
  console.log(`失败数: ${failed.length}`);
  console.log(`成功率: ${Math.round((successful.length / results.length) * 100)}%`);
  
  if (successful.length > 0) {
    console.log(`\n✅ 成功的接口 (${successful.length}个):`);
    successful.forEach(r => {
      console.log(`   • ${r.chartType}`);
    });
  }
  
  if (failed.length > 0) {
    console.log(`\n❌ 失败的接口 (${failed.length}个):`);
    failed.forEach(r => {
      console.log(`   • ${r.chartType}: ${r.error}`);
    });
  }
  
  // 保存详细结果
  const report = {
    timestamp: new Date().toISOString(),
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    successRate: Math.round((successful.length / results.length) * 100),
    results: results
  };
  
  fs.writeFileSync('FIXED_CHARTS_TEST_REPORT.json', JSON.stringify(report, null, 2));
  console.log(`\n📋 详细报告已保存到: FIXED_CHARTS_TEST_REPORT.json`);
}

// 运行测试
runAllTests().catch(console.error);
