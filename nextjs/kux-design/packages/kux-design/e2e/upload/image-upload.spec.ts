import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.serial('Upload Component E2E Tests - Image Upload', () => {
  const STORYBOOK_URL = 'http://localhost:6006';
  const testFile = path.join(__dirname, 'plane.png');

  // 用户旅程 1: 成功上传图片
  test('user journey - successful image upload', async ({ page }) => {
    console.log('=== 用户旅程: 成功上传图片 ===');

    // 拦截上传请求并模拟成功响应
    await page.route('**/upload', async (route) => {
      const url = route.request().url();
      const method = route.request().method();
      console.log(`拦截图片上传请求: ${method} ${url}`);
      
      // 添加延迟以模拟真实上传
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://example.com/uploaded-image.png',
          name: 'plane.png',
          size: 664000,
          type: 'image/png'
        })
      });
    });

    // 1. 用户访问图片上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--basic-image-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2. 用户看到上传区域
    const uploadArea = page.locator('.kux-upload_area-container');
    await expect(uploadArea).toBeVisible();
    console.log('✅ 上传区域可见');

    // 3. 用户点击上传区域
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadArea.click();
    const fileChooser = await fileChooserPromise;
    console.log('✅ 文件选择器弹出');

    // 4. 用户选择图片文件
    await fileChooser.setFiles(testFile);
    console.log('✅ 图片文件选择成功');

    // 5. 等待上传完成
    console.log('=== 等待上传完成 ===');
    await page.waitForTimeout(3000);
    
    // 检查是否有网络请求
    // console.log('=== 检查网络请求 ===');
    // const networkRequests = await page.evaluate(() => {
    //   return performance.getEntriesByType('resource')
    //     .filter((entry: any) => entry.name.includes('upload'))
    //     .map((entry: any) => ({
    //       name: entry.name,
    //       duration: entry.duration,
    //       transferSize: entry.transferSize
    //     }));
    // });
    // console.log('网络请求:', networkRequests);
    
    // 再等待一段时间
    await page.waitForTimeout(2000);

    // 6. 验证上传结果 - 检查图片预览
    // console.log('=== 验证图片预览显示状态 ===');
    
    // 检查上传组件的状态
    // console.log('=== 检查上传组件状态 ===');
    // const uploadComponentState = await page.evaluate(() => {
    //   const uploadComponent = document.querySelector('.kux-upload');
    //   if (!uploadComponent) return null;
      
    //   // 检查是否有任何隐藏的元素
    //   const allElements = uploadComponent.querySelectorAll('*');
    //   const elementsInfo = Array.from(allElements).map(el => ({
    //     tagName: el.tagName,
    //     className: el.className,
    //     style: el.getAttribute('style'),
    //     display: window.getComputedStyle(el).display,
    //     visibility: window.getComputedStyle(el).visibility,
    //     opacity: window.getComputedStyle(el).opacity
    //   }));
      
    //   return {
    //     elementCount: allElements.length,
    //     elementsInfo: elementsInfo.slice(0, 10) // 只显示前10个元素
    //   };
    // });
    // console.log('上传组件状态:', uploadComponentState);
    
    // 添加调试信息
    // console.log('=== 调试信息 ===');
    // const allElements = page.locator('*');
    // const elementCount = await allElements.count();
    // console.log('页面元素总数:', elementCount);
    
    // 检查上传组件
    const uploadComponent = page.locator('.kux-upload');
    const uploadCount = await uploadComponent.count();
    console.log('上传组件数量:', uploadCount);
    
    // 检查所有可能的图片预览元素
    // const possibleImageSelectors = [
    //   '.kux-upload_image-preview-item',
    //   '.kux-upload_image-preview-container',
    //   '.kux-upload_image-preview-image',
    //   'img',
    //   '[class*="image"]',
    //   '[class*="preview"]'
    // ];
    
    // for (const selector of possibleImageSelectors) {
    //   const elements = page.locator(selector);
    //   const count = await elements.count();
    //   console.log(`${selector} 数量:`, count);
    //   if (count > 0) {
    //     const firstElement = elements.first();
    //     const textContent = await firstElement.textContent();
    //     const className = await firstElement.getAttribute('class');
    //     console.log(`${selector} 内容:`, textContent);
    //     console.log(`${selector} 类名:`, className);
    //   }
    // }
    
    // 检查上传组件的内部结构
    console.log('=== 检查上传组件内部结构 ===');
    const uploadComponentContent = await uploadComponent.first().innerHTML();
    console.log('上传组件HTML内容:', uploadComponentContent);
    
    // 检查是否有任何上传相关的元素
    const uploadRelatedElements = page.locator('[class*="upload"]');
    const uploadRelatedCount = await uploadRelatedElements.count();
    console.log('上传相关元素数量:', uploadRelatedCount);
    
    // 检查是否有任何图片元素
    const allImages = page.locator('img');
    const allImagesCount = await allImages.count();
    console.log('所有图片元素数量:', allImagesCount);
    
    // 检查是否有任何按钮元素
    const allButtons = page.locator('button');
    const allButtonsCount = await allButtons.count();
    console.log('所有按钮元素数量:', allButtonsCount);
    
    // 检查是否有任何预览相关的元素
    const previewRelatedElements = page.locator('[class*="preview"]');
    const previewRelatedCount = await previewRelatedElements.count();
    console.log('预览相关元素数量:', previewRelatedCount);
  
    // 6.1 检查图片预览项是否存在
    const imagePreviewItems = page.locator('.kux-upload_image-preview-item');
    const imageCount = await imagePreviewItems.count();
    console.log('图片预览项数量:', imageCount);
    
    // 如果图片预览项不存在，尝试其他选择器
    if (imageCount === 0) {
      console.log('图片预览项不存在，尝试其他选择器...');
      
      // 检查是否有任何图片元素
      const anyImageElements = page.locator('img');
      const anyImageCount = await anyImageElements.count();
      console.log('任何图片元素数量:', anyImageCount);
      
      // 检查是否有任何预览容器
      const anyPreviewContainers = page.locator('[class*="preview"]');
      const anyPreviewCount = await anyPreviewContainers.count();
      console.log('任何预览容器数量:', anyPreviewCount);
      
      // 检查是否有任何上传相关的元素
      const anyUploadElements = page.locator('[class*="upload"]');
      const anyUploadCount = await anyUploadElements.count();
      console.log('任何上传元素数量:', anyUploadCount);
    }
    
    expect(imageCount).toBeGreaterThan(0);
    console.log('✅ 图片预览项显示成功');
  
    // 6.2 检查图片是否显示
    const imageElements = page.locator('.kux-upload_image-preview-image');
    const imageElementCount = await imageElements.count();
    console.log('图片元素数量:', imageElementCount);
    expect(imageElementCount).toBeGreaterThan(0);
    console.log('✅ 图片显示成功');
  
    // 6.3 先hover触发overlay显示
    const imageContainer = page.locator('.kux-upload_image-preview-container').first();
    await imageContainer.hover();
    console.log('✅ 鼠标悬停在图片上');
    
    // 等待overlay显示
    await page.waitForTimeout(500);
    
    // 6.4 检查overlay是否显示
    const overlayElements = page.locator('.kux-upload_image-preview-overlay');
    const overlayCount = await overlayElements.count();
    console.log('Overlay元素数量:', overlayCount);
    expect(overlayCount).toBeGreaterThan(0);
    console.log('✅ Overlay显示成功');
    
    // 6.5 检查图片预览容器
    // const imageContainers = page.locator('.kux-upload_image-preview-container');
    // const containerCount = await imageContainers.count();
    // console.log('图片预览容器数量:', containerCount);
    // expect(containerCount).toBeGreaterThan(0);
    // console.log('✅ 图片预览容器显示成功');
  
    // 6.6 检查hover时的删除按钮
    const deleteButtons = page.locator('.kux-upload_image-preview-button--delete');
    const deleteCount = await deleteButtons.count();
    console.log('删除按钮数量:', deleteCount);
    expect(deleteCount).toBeGreaterThan(0);
    console.log('✅ 删除按钮显示成功');
  
    // 6.7 检查预览按钮
    const previewButtons = page.locator('.kux-upload_image-preview-button--preview');
    const previewCount = await previewButtons.count();
    console.log('预览按钮数量:', previewCount);
    expect(previewCount).toBeGreaterThan(0);
    console.log('✅ 预览按钮显示成功');
  
    // 6.8 检查错误状态是否隐藏（上传成功时应该隐藏）
    const errorElements = page.locator('.kux-upload_image-preview-container--error');
    const errorCount = await errorElements.count();
    console.log('错误状态元素数量:', errorCount);
    expect(errorCount).toBe(0);
    console.log('✅ 错误状态正确隐藏（上传成功）');
    
    // 6.9 检查重试按钮是否隐藏（上传成功时应该隐藏）
    const retryButtons = page.locator('.kux-upload_image-preview-button--retry');
    const retryCount = await retryButtons.count();
    console.log('重试按钮数量:', retryCount);
    expect(retryCount).toBe(0);
    console.log('✅ 重试按钮正确隐藏（上传成功）');
  
    console.log('✅ 图片上传成功，所有UI元素显示正确');
  });

  // 用户旅程 2: 图片上传失败后重试
  // test('user journey - image upload failure and retry', async ({ page }) => {
  //   console.log('=== 用户旅程: 图片上传失败后重试 ===');

  //   // 拦截上传请求并模拟失败响应
  //   await page.route('**/upload', async (route) => {
  //     const url = route.request().url();
  //     const method = route.request().method();
  //     console.log(`拦截图片上传失败请求: ${method} ${url}`);
      
  //     await route.fulfill({
  //       status: 500,
  //       contentType: 'application/json',
  //       body: JSON.stringify({
  //         error: 'Upload failed'
  //       })
  //     });
  //   });

  //   // 1. 用户访问图片上传页面
  //   await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--basic-image-upload&viewMode=story`);
  //   await page.waitForLoadState('networkidle');
  //   await page.waitForTimeout(2000);

  //   // 2. 用户点击上传区域并选择文件
  //   const uploadArea = page.locator('.kux-upload_area-container');
  //   const fileChooserPromise = page.waitForEvent('filechooser');
  //   await uploadArea.click();
  //   const fileChooser = await fileChooserPromise;
  //   await fileChooser.setFiles(testFile);
  //   console.log('✅ 图片文件选择成功');

  //   // 3. 等待上传失败
  //   await page.waitForTimeout(5000);

  //   // 4. 验证失败状态
  //   console.log('=== 验证上传失败状态 ===');
    
  //   // 4.1 检查错误状态的图片预览
  //   const errorImagePreview = page.locator('.kux-upload_image-preview-container--error');
  //   const errorCount = await errorImagePreview.count();
  //   console.log('错误状态图片预览数量:', errorCount);
  //   expect(errorCount).toBeGreaterThan(0);
  //   console.log('✅ 错误状态图片预览显示成功');
    
  //   // 4.2 检查重试按钮
  //   const retryButtons = page.locator('.kux-upload_image-preview-button--retry');
  //   const retryCount = await retryButtons.count();
  //   console.log('重试按钮数量:', retryCount);
  //   expect(retryCount).toBeGreaterThan(0);
  //   console.log('✅ 重试按钮显示成功');
    
  //   // 4.3 检查删除按钮
  //   const deleteButtons = page.locator('.kux-upload_image-preview-button--delete');
  //   const deleteCount = await deleteButtons.count();
  //   console.log('删除按钮数量:', deleteCount);
  //   expect(deleteCount).toBeGreaterThan(0);
  //   console.log('✅ 删除按钮显示成功');
    
  //   // 4.4 检查错误信息
  //   const errorMessages = page.locator('.kux-upload_image-preview-error');
  //   const errorMessageCount = await errorMessages.count();
  //   console.log('错误信息数量:', errorMessageCount);
  //   expect(errorMessageCount).toBeGreaterThan(0);
  //   console.log('✅ 错误信息显示成功');

  //   // 5. 点击重试按钮
  //   console.log('=== 点击重试按钮 ===');
    
  //   // 重新拦截请求并模拟成功响应
  //   await page.route('**/upload', async (route) => {
  //     const url = route.request().url();
  //     const method = route.request().method();
  //     console.log(`重试拦截请求: ${method} ${url}`);
      
  //     await route.fulfill({
  //       status: 200,
  //       contentType: 'application/json',
  //       body: JSON.stringify({
  //         url: 'https://example.com/retry-success.png',
  //         name: 'plane.png',
  //         size: 664000,
  //         type: 'image/png'
  //       })
  //     });
  //   });
    
  //   await retryButtons.first().click();
  //   console.log('✅ 点击重试按钮');
    
  //   // 6. 等待重试成功
  //   await page.waitForTimeout(5000);
    
  //   // 7. 验证重试成功状态
  //   console.log('=== 验证重试成功状态 ===');
    
  //   // 7.1 检查成功状态的图片预览
  //   const successImagePreview = page.locator('.kux-upload_image-preview-container:not(.kux-upload_image-preview-container--error)');
  //   const successCount = await successImagePreview.count();
  //   console.log('成功状态图片预览数量:', successCount);
  //   expect(successCount).toBeGreaterThan(0);
  //   console.log('✅ 重试成功，图片预览显示正确');
    
  //   // 7.2 检查重试按钮已隐藏
  //   const retryButtonsAfterSuccess = page.locator('.kux-upload_image-preview-button--retry');
  //   const retryCountAfterSuccess = await retryButtonsAfterSuccess.count();
  //   console.log('重试成功后重试按钮数量:', retryCountAfterSuccess);
  //   expect(retryCountAfterSuccess).toBe(0);
  //   console.log('✅ 重试按钮已隐藏');
    
  //   // 7.3 检查预览和删除按钮显示
  //   const previewButtons = page.locator('.kux-upload_image-preview-button--preview');
  //   const deleteButtonsAfterSuccess = page.locator('.kux-upload_image-preview-button--delete');
  //   const previewCount = await previewButtons.count();
  //   const deleteCountAfterSuccess = await deleteButtonsAfterSuccess.count();
  //   console.log('预览按钮数量:', previewCount);
  //   console.log('删除按钮数量:', deleteCountAfterSuccess);
  //   expect(previewCount).toBeGreaterThan(0);
  //   expect(deleteCountAfterSuccess).toBeGreaterThan(0);
  //   console.log('✅ 预览和删除按钮显示正确');
    
  //   console.log('✅ 图片上传失败后重试测试完成');
  // });

  // 用户旅程 3: 删除已上传的图片
  // test('user journey - delete uploaded image', async ({ page }) => {
  //   console.log('=== 用户旅程: 删除已上传的图片 ===');

  //   // 拦截上传请求并模拟成功响应
  //   await page.route('**/upload', async (route) => {
  //     const url = route.request().url();
  //     const method = route.request().method();
  //     console.log(`删除测试拦截请求: ${method} ${url}`);
      
  //     await route.fulfill({
  //       status: 200,
  //       contentType: 'application/json',
  //       body: JSON.stringify({
  //         url: 'https://example.com/delete-test.png',
  //         name: 'plane.png',
  //         size: 664000,
  //         type: 'image/png'
  //       })
  //     });
  //   });

  //   // 1. 用户访问图片上传页面
  //   await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--basic-image-upload&viewMode=story`);
  //   await page.waitForLoadState('networkidle');
  //   await page.waitForTimeout(2000);

  //   // 2. 用户上传图片
  //   const uploadArea = page.locator('.kux-upload_area-container');
  //   const fileChooserPromise = page.waitForEvent('filechooser');
  //   await uploadArea.click();
  //   const fileChooser = await fileChooserPromise;
  //   await fileChooser.setFiles(testFile);
  //   console.log('✅ 图片文件选择成功');

  //   // 3. 等待上传完成
  //   await page.waitForTimeout(5000);

  //   // 4. 验证图片已上传
  //   const imagePreviewItems = page.locator('.kux-upload_image-preview-item');
  //   const imageCount = await imagePreviewItems.count();
  //   console.log('上传后图片预览项数量:', imageCount);
  //   expect(imageCount).toBeGreaterThan(0);
  //   console.log('✅ 图片上传成功');

  //   // 5. 删除图片
  //   console.log('=== 删除图片 ===');
    
  //   // 5.1 悬停显示删除按钮
  //   const imageContainer = page.locator('.kux-upload_image-preview-container');
  //   await imageContainer.first().hover();
  //   console.log('✅ 鼠标悬停在图片上');
    
  //   // 5.2 点击删除按钮
  //   const deleteButtons = page.locator('.kux-upload_image-preview-button--delete');
  //   const deleteCount = await deleteButtons.count();
  //   console.log('删除按钮数量:', deleteCount);
  //   expect(deleteCount).toBeGreaterThan(0);
    
  //   await deleteButtons.first().click();
  //   console.log('✅ 点击删除按钮');

  //   // 6. 验证图片已删除
  //   await page.waitForTimeout(2000);
    
  //   const imagePreviewItemsAfterDelete = page.locator('.kux-upload_image-preview-item');
  //   const imageCountAfterDelete = await imagePreviewItemsAfterDelete.count();
  //   console.log('删除后图片预览项数量:', imageCountAfterDelete);
  //   expect(imageCountAfterDelete).toBe(0);
  //   console.log('✅ 图片已成功删除');

  //   // 7. 验证上传区域重新显示
  //   const uploadAreaAfterDelete = page.locator('.kux-upload_area-container');
  //   const uploadAreaVisible = await uploadAreaAfterDelete.isVisible();
  //   console.log('删除后上传区域是否可见:', uploadAreaVisible);
  //   expect(uploadAreaVisible).toBe(true);
  //   console.log('✅ 上传区域重新显示');

  //   console.log('✅ 删除已上传的图片测试完成');
  // });
}); 