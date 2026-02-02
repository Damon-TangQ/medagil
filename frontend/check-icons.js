const icons = require('./node_modules/@element-plus/icons-vue/dist/index.cjs');
const iconNames = Object.keys(icons);

// 查找包含Home或Inbox的图标
const homeIcons = iconNames.filter(name => name.toLowerCase().includes('home'));
const inboxIcons = iconNames.filter(name => name.toLowerCase().includes('inbox'));

console.log('包含Home的图标:', homeIcons);
console.log('包含Inbox的图标:', inboxIcons);

// 查找一些常用的导航图标
const navIcons = iconNames.filter(name => 
  name.toLowerCase().includes('house') ||
  name.toLowerCase().includes('message') ||
  name.toLowerCase().includes('folder') ||
  name.toLowerCase().includes('document') ||
  name.toLowerCase().includes('list') ||
  name.toLowerCase().includes('setting')
);
console.log('常用的导航图标:', navIcons);
