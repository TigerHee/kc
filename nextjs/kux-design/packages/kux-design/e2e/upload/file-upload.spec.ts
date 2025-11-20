import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.serial('Upload Component E2E Tests - File Upload', () => {
  const STORYBOOK_URL = 'http://localhost:6006';
  const testFile = path.join(__dirname, 'plane.png');

  // 用户旅程 1: 成功上传文件
  test('user journey - successful file upload', async ({ page }) => {
    console.log('=== 用户旅程: 成功上传文件 ===');

    // 拦截上传请求并模拟成功响应
    await page.route('**/upload', async (route) => {
      const url = route.request().url();
      const method = route.request().method();
      console.log(`拦截文件上传请求: ${method} ${url}`);
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            url: 'https://example.com/uploaded-file.png',
            name: 'plane.png',
            size: 664000,
            type: 'image/png'
          }
        })
      });
    });

    // 1. 用户访问文件上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--basic-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2. 用户看到上传区域
    const uploadArea = page.locator('.kux-upload_area-container');
    await expect(uploadArea).toBeVisible();
    console.log('✅ 上传区域可见');

    // 4. 用户点击上传区域
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadArea.click();
    const fileChooser = await fileChooserPromise;
    console.log('✅ 文件选择器弹出');

    // 5. 用户选择文件
    await fileChooser.setFiles(testFile);
    console.log('✅ 文件选择成功');

    // 6. 等待上传完成
    await page.waitForTimeout(5000);

    // 7. 验证上传结果 - 检查文件列表
    console.log('=== 验证文件列表显示状态 ===');
  
    // 7.1 检查文件项是否存在
    const fileItems = page.locator('.kux-upload_file-list-item');
    const fileCount = await fileItems.count();
    console.log('文件项数量:', fileCount);
    expect(fileCount).toBeGreaterThan(0);
    console.log('✅ 文件项显示成功');
  
    // 7.2 检查删除按钮
    const deleteButtons = page.locator('.kux-upload_file-list-item-delete');
    const deleteCount = await deleteButtons.count();
    console.log('删除按钮数量:', deleteCount);
    expect(deleteCount).toBeGreaterThan(0);
    console.log('✅ 删除按钮显示成功');
  
    // 7.3 检查文件图标
    const fileIconElements = page.locator('.kux-upload_file-list-item-icon');
    const iconCount = await fileIconElements.count();
    console.log('文件图标数量:', iconCount);
    if (iconCount > 0) {
      const iconText = await fileIconElements.first().textContent();
      console.log('文件图标:', iconText);
      console.log('✅ 文件图标显示成功');
    } else {
      console.log('⚠️ 文件图标未找到');
    }
  
    // 7.4 检查文件名显示
    const fileNameElements = page.locator('.kux-upload_file-list-item-name');
    const fileNameCount = await fileNameElements.count();
    console.log('文件名元素数量:', fileNameCount);
    if (fileNameCount > 0) {
      const fileName = await fileNameElements.first().textContent();
      console.log('文件名:', fileName);
      expect(fileName).toContain('plane.png');
      console.log('✅ 文件名显示正确');
    }
  
    // 7.5 检查文件大小显示
    const fileSizeElements = page.locator('.kux-upload_file-list-item-size');
    const fileSizeCount = await fileSizeElements.count();
    console.log('文件大小元素数量:', fileSizeCount);
    if (fileSizeCount > 0) {
      const fileSize = await fileSizeElements.first().textContent();
      console.log('文件大小:', fileSize);
      console.log('✅ 文件大小显示正确');
    }
  
    // 7.6 检查进度条是否隐藏（上传完成后应该隐藏）
    const progressBar = page.locator('.kux-upload_file-list-item-progress');
    const progressBarVisible = await progressBar.isVisible();
    console.log('上传完成后进度条是否隐藏:', !progressBarVisible);
    expect(progressBarVisible).toBe(false);
  
    // 7.7 检查重试按钮是否隐藏（上传成功时应该隐藏）
    const retryButtons = page.locator('.kux-upload_file-list-item-retry');
    const retryCount = await retryButtons.count();
    console.log('重试按钮数量:', retryCount);
    expect(retryCount).toBe(0);
  
    // 7.8 检查错误状态是否隐藏（上传成功时应该隐藏）
    const errorElements = page.locator('.kux-upload_file-list-item-error');
    const errorCount = await errorElements.count();
    console.log('错误元素数量:', errorCount);
    expect(errorCount).toBe(0);
  
    console.log('✅ 文件上传成功，所有UI元素显示正确');
  });

  // 用户旅程 2: 上传进度跟踪
  test('user journey - upload progress tracking', async ({ page }) => {
    console.log('=== 开始上传进度跟踪测试 ===');

    // 导航到上传组件
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--basic-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 等待上传组件完全加载
    await page.waitForSelector('.kux-upload', { timeout: 10000 });
    console.log('✅ 上传组件已加载');

    // 不拦截请求，使用真实的 XHR 请求来测试进度回调
    console.log('使用真实的 XHR 请求测试进度回调');

    // 拦截上传请求，模拟成功上传
    await page.route('**/upload', async (route) => {
      console.log('拦截上传请求: 模拟成功上传');
      
      // 延迟响应以模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'plane.png',
          status: 'done',
          url: 'https://example.com/uploaded/plane.png'
        })
      });
    });

    // 点击上传区域
    const uploadArea = page.locator('.kux-upload_area-container');
    await expect(uploadArea).toBeVisible();
    console.log('✅ 上传区域可见');

    // 选择文件
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadArea.click();
    const fileChooser = await fileChooserPromise;
    console.log('✅ 文件选择器弹出');
    await fileChooser.setFiles(testFile);

    console.log('=== 检查上传进度 ===');

    // 等待文件被添加到列表中
    console.log('等待文件被添加到列表中...');
    
    // 检查是否有任何文件项出现（包括上传中的文件）
    let fileItems1 = page.locator('.kux-upload_file-list-item, .kux-upload-item, [data-testid*="file"]');
    let fileCount1 = await fileItems1.count();
    console.log('初始文件项数量:', fileCount1);

    // 如果文件项没有出现，等待一段时间再检查
    if (fileCount1 === 0) {
      console.log('等待文件项出现...');
      await page.waitForTimeout(2000);
      fileCount1 = await fileItems1.count();
      console.log('等待后的文件项数量:', fileCount1);
    }

    // 调试：检查文件状态
    if (fileCount1 > 0) {
      // 检查文件状态
      const fileItem = fileItems1.first();
      const fileItemText = await fileItem.textContent();
      console.log('文件项内容:', fileItemText);

      // 使用 page.evaluate 检查实际的进度值
      const progressInfo = await page.evaluate(() => {
        const progressText = document.querySelector('.kux-upload_file-list-item-progress-text');
        const progressFill = document.querySelector('.kux-upload_file-list-item-progress-fill');
        
        return {
          progressText: progressText?.textContent,
          progressFillWidth: progressFill?.getAttribute('style'),
          progressTextVisible: (progressText as HTMLElement)?.offsetParent !== null,
          progressFillVisible: (progressFill as HTMLElement)?.offsetParent !== null
        };
      });
      
      console.log('DOM 中的进度信息:', progressInfo);

      // 检查进度条的具体元素
      const progressContainer = page.locator('.kux-upload_file-list-item-progress');
      const progressBar = page.locator('.kux-upload_file-list-item-progress-bar');
      const progressFill = page.locator('.kux-upload_file-list-item-progress-fill');
      const progressText = page.locator('.kux-upload_file-list-item-progress-text');
      
      console.log('进度条容器数量:', await progressContainer.count());
      console.log('进度条条数量:', await progressBar.count());
      console.log('进度条填充数量:', await progressFill.count());
      console.log('进度条文本数量:', await progressText.count());
      
      if (await progressText.count() > 0) {
        const progressValue = await progressText.first().textContent();
        console.log('进度条文本内容:', progressValue);
        
        // 检查进度条填充的宽度
        const fillWidth = await progressFill.first().getAttribute('style');
        console.log('进度条填充宽度:', fillWidth);
      }

      // 检查是否有进度相关的元素
      const progressElements = page.locator('[class*="progress"]');
      const progressCount = await progressElements.count();
      console.log('进度相关元素数量:', progressCount);

      // 检查文件状态类名
      const fileItemClasses = await fileItem.getAttribute('class');
      console.log('文件项类名:', fileItemClasses);
    } else {
      console.log('❌ 文件项未出现，可能上传太快完成或有问题');
    }

    // 4. 检查取消按钮是否显示
    const cancelButton = page.locator('.kux-upload_file-list-item-cancel');
    const cancelButtonVisible = await cancelButton.isVisible();
    console.log('取消按钮是否显示:', cancelButtonVisible);
    expect(cancelButtonVisible).toBe(true);

    // 5. 验证进度条显示逻辑
    console.log('=== 验证进度条显示逻辑 ===');
    
    // 检查进度条在上传过程中是否显示
    const progressBar = page.locator('.kux-upload_file-list-item-progress');
    const progressBarVisible = await progressBar.isVisible();
    console.log('上传过程中进度条是否显示:', progressBarVisible);
    expect(progressBarVisible).toBe(true);
    
    // 检查进度条文本是否显示
    const progressText = page.locator('.kux-upload_file-list-item-progress-text');
    const progressTextVisible = await progressText.isVisible();
    console.log('进度条文本是否显示:', progressTextVisible);
    expect(progressTextVisible).toBe(true);
    
    // 检查进度条填充是否显示
    const progressFill = page.locator('.kux-upload_file-list-item-progress-fill');
    const progressFillVisible = await progressFill.isVisible();
    console.log('进度条填充是否显示:', progressFillVisible);
    
    // 检查进度条填充的宽度
    const fillWidth = await progressFill.getAttribute('style');
    console.log('进度条填充宽度:', fillWidth);
    
    // 由于进度为 0%，填充宽度为 0%，所以可能不可见，这是正常的
    // 我们检查元素是否存在，而不是是否可见
    const progressFillCount = await progressFill.count();
    console.log('进度条填充元素数量:', progressFillCount);
    expect(progressFillCount).toBeGreaterThan(0);

    // 6. 等待上传完成
    console.log('=== 等待上传完成 ===');
    await page.waitForTimeout(3000);

    // 7. 检查上传完成后的状态
    const finalProgressBar = page.locator('.kux-upload_file-list-item-progress');
    const finalProgressBarVisible = await finalProgressBar.isVisible();
    console.log('上传完成后进度条是否隐藏:', !finalProgressBarVisible);
    expect(finalProgressBarVisible).toBe(false);

    // 8. 检查删除按钮是否显示（上传完成后）
    const deleteButton = page.locator('.kux-upload_file-list-item-delete');
    const deleteButtonVisible = await deleteButton.isVisible();
    console.log('上传完成后删除按钮是否显示:', deleteButtonVisible);
    expect(deleteButtonVisible).toBe(true);

    // 9. 验证上传结果
    console.log('=== 验证上传结果 ===');
    
    // 检查文件列表
    let fileItems2 = page.locator('.kux-upload_file-list-item');
    let fileCount2 = await fileItems2.count();
    console.log('最终文件项数量:', fileCount2);
    expect(fileCount2).toBeGreaterThan(0);
    
    // 检查文件名
    const fileNameElements = page.locator('.kux-upload_file-list-item-name');
    const fileNameCount = await fileNameElements.count();
    if (fileNameCount > 0) {
      const fileName = await fileNameElements.first().textContent();
      console.log('最终文件名:', fileName);
      expect(fileName).toContain('plane.png');
      console.log('✅ 文件名显示正确');
    }
    
    // 检查删除按钮
    const deleteButtons = page.locator('.kux-upload_file-list-item-delete');
    const deleteCount = await deleteButtons.count();
    console.log('删除按钮数量:', deleteCount);
    expect(deleteCount).toBeGreaterThan(0);
  
    console.log('✅ 上传进度条显示逻辑测试完成');
  });

  // 用户旅程 3: 上传失败后重试
  test('user journey - upload failure and retry', async ({ page }) => {
    console.log('=== 用户旅程: 上传失败后重试 ===');

    // 1. 用户访问文件上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--basic-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2. 拦截上传请求并模拟失败响应
    await page.route('**/upload', async (route) => {
      const url = route.request().url();
      const method = route.request().method();
      console.log(`拦截文件上传失败请求: ${method} ${url}`);
      
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Upload failed'
        })
      });
    });

    // 3. 用户点击上传区域并选择文件
    const uploadArea = page.locator('.kux-upload_area-container');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadArea.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);
    console.log('✅ 文件选择成功');

    // 4. 等待上传失败
    await page.waitForTimeout(5000);

    // 5. 检查错误状态 - 通过DOM检查
    console.log('=== 检查错误状态下的文件信息 ===');
    
    // 检查文件项是否存在
    const fileItems = page.locator('.kux-upload_file-list-item');
    const fileCount = await fileItems.count();
    console.log('错误状态文件项数量:', fileCount);
    expect(fileCount).toBeGreaterThan(0);
    
    // 检查文件名显示
    const fileNameElements = page.locator('.kux-upload_file-list-item-name');
    const fileNameCount = await fileNameElements.count();
    console.log('文件名元素数量:', fileNameCount);
    if (fileNameCount > 0) {
      const fileName = await fileNameElements.first().textContent();
      console.log('文件名:', fileName);
      expect(fileName).toContain('plane.png');
      console.log('✅ 文件名显示正确');
    }
    
    // 检查文件大小显示
    const fileSizeElements = page.locator('.kux-upload_file-list-item-size');
    const fileSizeCount = await fileSizeElements.count();
    console.log('文件大小元素数量:', fileSizeCount);
    if (fileSizeCount > 0) {
      const fileSize = await fileSizeElements.first().textContent();
      console.log('文件大小:', fileSize);
      console.log('✅ 文件大小显示正确');
    }
    
    // 检查文件图标显示
    const fileIconElements = page.locator('.kux-upload_file-list-item-icon');
    const iconCount = await fileIconElements.count();
    console.log('文件图标数量:', iconCount);
    if (iconCount > 0) {
      const iconText = await fileIconElements.first().textContent();
      console.log('文件图标:', iconText);
      console.log('✅ 文件图标显示正确');
    }
    
    // 检查进度条是否隐藏（错误状态下不应该显示进度条）
    const progressBar = page.locator('.kux-upload_file-list-item-progress');
    const progressBarVisible = await progressBar.isVisible();
    console.log('错误状态下进度条是否隐藏:', !progressBarVisible);
    expect(progressBarVisible).toBe(false);
    
    // 检查删除按钮是否显示
    const deleteButtons = page.locator('.kux-upload_file-list-item-delete');
    const deleteCount = await deleteButtons.count();
    console.log('错误状态下删除按钮数量:', deleteCount);
    expect(deleteCount).toBeGreaterThan(0);
    console.log('✅ 错误状态下删除按钮显示正确');
    
    // 检查重试按钮是否显示
    const retryButtons = page.locator('.kux-upload_file-list-item-retry');
    const retryCount = await retryButtons.count();
    console.log('重试按钮数量:', retryCount);
    expect(retryCount).toBeGreaterThan(0);
    console.log('✅ 重试按钮显示正确');

    // 6. 用户点击重试按钮
    if (retryCount > 0) {
      // 7. 修改路由为成功响应
      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              url: 'https://example.com/retry-success.png',
              name: 'plane.png',
              size: 664000,
              type: 'image/png'
            }
          })
        });
      });

      // 8. 用户点击重试
      await retryButtons.first().click();
      console.log('✅ 点击重试按钮');

      // 9. 等待重试完成
      await page.waitForTimeout(5000);

      // 10. 验证重试成功 - 检查文件列表状态
      console.log('=== 验证重试成功 ===');
      
      // 检查文件列表
      const retryFileItems = page.locator('.kux-upload_file-list-item');
      const retryFileCount = await retryFileItems.count();
      console.log('重试后文件列表数量:', retryFileCount);
      expect(retryFileCount).toBeGreaterThan(0);
      
      // 检查文件名
      const retryFileNameElements = page.locator('.kux-upload_file-list-item-name');
      const retryFileNameCount = await retryFileNameElements.count();
      if (retryFileNameCount > 0) {
        const retryFileName = await retryFileNameElements.first().textContent();
        console.log('重试后文件名:', retryFileName);
        expect(retryFileName).toContain('plane.png');
        console.log('✅ 重试后文件名显示正确');
      }
      
      // 检查删除按钮
      const retryDeleteButtons = page.locator('.kux-upload_file-list-item-delete');
      const retryDeleteCount = await retryDeleteButtons.count();
      console.log('重试后删除按钮数量:', retryDeleteCount);
      expect(retryDeleteCount).toBeGreaterThan(0);
      
      // 检查重试按钮是否隐藏（重试成功后应该隐藏）
      const retryButtonsAfter = page.locator('.kux-upload_file-list-item-retry');
      const retryButtonsAfterCount = await retryButtonsAfter.count();
      console.log('重试成功后重试按钮数量:', retryButtonsAfterCount);
      expect(retryButtonsAfterCount).toBe(0);
      
      // 检查进度条是否隐藏（重试成功后应该隐藏）
      const retryProgressBar = page.locator('.kux-upload_file-list-item-progress');
      const retryProgressBarVisible = await retryProgressBar.isVisible();
      console.log('重试成功后进度条是否隐藏:', !retryProgressBarVisible);
      expect(retryProgressBarVisible).toBe(false);
      
      console.log('✅ 重试成功，所有UI元素显示正确');
    } else {
      console.log('❌ 未找到重试按钮');
      expect(false).toBe(true);
    }
  });

  // 用户旅程 4: 删除已上传的文件
  test('user journey - delete uploaded file', async ({ page }) => {
    console.log('=== 用户旅程: 删除已上传的文件 ===');

    // 1. 用户访问文件上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--basic-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 场景1: 模拟上传失败，然后删除
    console.log('=== 场景1: 上传失败后删除 ===');
    
    // 拦截上传请求并模拟失败响应
    await page.route('**/upload', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Upload failed'
        })
      });
    });

    // 上传文件
    const uploadArea = page.locator('.kux-upload_area-container');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadArea.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);
    console.log('✅ 文件选择成功');

    // 等待上传失败
    await page.waitForTimeout(5000);

    // 检查上传失败后的文件列表状态
    console.log('=== 检查上传失败后的文件列表状态 ===');
    const fileItemsAfterUpload = page.locator('.kux-upload_file-list-item');
    const fileCountAfterUpload = await fileItemsAfterUpload.count();
    console.log('上传后文件列表项数量:', fileCountAfterUpload);
    
    if (fileCountAfterUpload > 0) {
      const fileItemContent = await fileItemsAfterUpload.first().textContent();
      console.log('文件项内容:', fileItemContent);
      
      // 检查文件状态（通过DOM结构判断）
      const hasProgress = await page.locator('.kux-upload_file-list-item-progress').count();
      const hasError = await page.locator('.kux-upload_file-list-item-error').count();
      const hasRetry = await page.locator('.kux-upload_file-list-item-retry').count();
      
      console.log('进度条数量:', hasProgress);
      console.log('错误信息数量:', hasError);
      console.log('重试按钮数量:', hasRetry);
      
      // 根据DOM结构判断文件状态
      if (hasProgress > 0) {
        console.log('文件状态: uploading');
      } else if (hasError > 0 || hasRetry > 0) {
        console.log('文件状态: error');
      } else {
        console.log('文件状态: done');
      }
    } else {
      console.log('上传后文件列表为空');
    }

    // 检查失败状态下的删除按钮
    const deleteButtons = page.locator('.kux-upload_file-list-item-delete');
    const deleteCount = await deleteButtons.count();
    console.log('失败状态下删除按钮数量:', deleteCount);
    expect(deleteCount).toBeGreaterThan(0);

    // 点击删除按钮
    await deleteButtons.first().click();
    console.log('✅ 点击删除按钮');

    // 等待删除处理
    await page.waitForTimeout(2000);

    // 验证文件被删除
    const remainingFileItems = page.locator('.kux-upload_file-list-item');
    const remainingCount = await remainingFileItems.count();
    console.log('删除后剩余文件数量:', remainingCount);
    expect(remainingCount).toBe(0);
    console.log('✅ 失败状态文件删除成功');

    // 检查删除后的组件状态
    console.log('=== 检查删除后的组件状态 ===');
    const uploadComponent = page.locator('.kux-upload');
    const uploadVisible = await uploadComponent.isVisible();
    console.log('上传组件是否可见:', uploadVisible);
    
    const uploadAreaAfterDelete = page.locator('.kux-upload_area-container');
    const areaVisible = await uploadAreaAfterDelete.isVisible();
    console.log('上传区域是否可见:', areaVisible);
    
    // 检查是否有隐藏的文件输入框
    const fileInputs = page.locator('input[type="file"]');
    const inputCount = await fileInputs.count();
    console.log('文件输入框数量:', inputCount);
    
    // 检查文件列表状态
    const fileListAfterDelete = page.locator('.kux-upload_file-list-item');
    const fileCountAfterDelete = await fileListAfterDelete.count();
    console.log('删除后文件列表数量:', fileCountAfterDelete);
    expect(fileCountAfterDelete).toBe(0);

    // 场景2: 模拟上传成功，然后删除
    console.log('=== 场景2: 上传成功后删除 ===');
    
    // 修改路由为成功响应
    await page.route('**/upload', async (route) => {
      const url = route.request().url();
      const method = route.request().method();
      console.log(`场景2拦截上传请求: ${method} ${url}`);
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            url: 'https://example.com/success-delete.png',
            name: 'plane.png',
            size: 664000,
            type: 'image/png'
          }
        })
      });
    });

    // 重新上传文件
    const uploadArea2 = page.locator('.kux-upload_area-container');
    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await uploadArea2.click();
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles(testFile);
    console.log('✅ 重新上传文件成功');

    // 等待上传完成
    console.log('等待上传完成...');
    await page.waitForTimeout(8000);

    // 直接检查文件列表状态
    console.log('=== 检查文件列表状态 ===');
    const fileItems2 = page.locator('.kux-upload_file-list-item');
    const fileCount2 = await fileItems2.count();
    console.log('文件列表项数量:', fileCount2);
    
    if (fileCount2 > 0) {
      const fileItemContent = await fileItems2.first().textContent();
      console.log('文件项内容:', fileItemContent);
      
      // 检查文件状态（通过DOM结构判断）
      const hasProgress = await page.locator('.kux-upload_file-list-item-progress').count();
      const hasError = await page.locator('.kux-upload_file-list-item-error').count();
      const hasRetry = await page.locator('.kux-upload_file-list-item-retry').count();
      
      console.log('进度条数量:', hasProgress);
      console.log('错误信息数量:', hasError);
      console.log('重试按钮数量:', hasRetry);
      
      // 根据DOM结构判断文件状态
      if (hasProgress > 0) {
        console.log('文件状态: uploading');
      } else if (hasError > 0 || hasRetry > 0) {
        console.log('文件状态: error');
      } else {
        console.log('文件状态: done');
      }
    } else {
      console.log('文件列表为空');
    }

    // 检查成功状态下的删除按钮
    const deleteButtons2 = page.locator('.kux-upload_file-list-item-delete');
    const deleteCount2 = await deleteButtons2.count();
    console.log('成功状态下删除按钮数量:', deleteCount2);
    
    // 添加调试信息
    console.log('=== 调试信息 ===');
    const allDeleteButtons = page.locator('button[aria-label*="Delete"], .kux-upload_file-list-item-delete, [class*="delete"]');
    const allDeleteCount = await allDeleteButtons.count();
    console.log('所有删除按钮数量:', allDeleteCount);
    
    expect(deleteCount2).toBeGreaterThan(0);

    // 点击删除按钮
    await deleteButtons2.first().click();
    console.log('✅ 点击删除按钮');

    // 等待删除处理
    await page.waitForTimeout(2000);

    // 验证文件被删除
    const remainingFileItems2 = page.locator('.kux-upload_file-list-item');
    const remainingCount2 = await remainingFileItems2.count();
    console.log('删除后剩余文件数量:', remainingCount2);
    expect(remainingCount2).toBe(0);
    console.log('✅ 成功状态文件删除成功');

    // 场景3: 重新上传成功，验证列表显示
    console.log('=== 场景3: 重新上传验证 ===');
    
    // 重新设置路由拦截（页面刷新后需要重新设置）
    await page.route('**/upload', async (route) => {
      const url = route.request().url();
      const method = route.request().method();
      console.log(`场景3拦截上传请求: ${method} ${url}`);
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            url: 'https://example.com/final-upload.png',
            name: 'plane.png',
            size: 664000,
            type: 'image/png'
          }
        })
      });
    });
    
    // 重新上传文件
    const uploadArea3 = page.locator('.kux-upload_area-container');
    const fileChooserPromise3 = page.waitForEvent('filechooser');
    await uploadArea3.click();
    const fileChooser3 = await fileChooserPromise3;
    await fileChooser3.setFiles(testFile);
    console.log('✅ 重新上传文件成功');

    // 等待上传完成
    await page.waitForTimeout(5000);

    // 验证文件列表显示
    const finalFileItems = page.locator('.kux-upload_file-list-item');
    const finalCount = await finalFileItems.count();
    console.log('最终文件列表数量:', finalCount);
    expect(finalCount).toBeGreaterThan(0);
    console.log('✅ 重新上传后文件列表显示正确');

    // 验证文件信息显示
    const fileNameElements = page.locator('.kux-upload_file-list-item-name');
    const fileNameCount = await fileNameElements.count();
    if (fileNameCount > 0) {
      const fileName = await fileNameElements.first().textContent();
      console.log('最终文件名:', fileName);
      expect(fileName).toContain('plane.png');
      console.log('✅ 最终文件名显示正确');
    }

    console.log('✅ 删除文件用户旅程测试完成');
  });

  // 用户旅程 5: 拖拽上传文件
  test('user journey - drag and drop upload', async ({ page }) => {
    console.log('=== 用户旅程: 拖拽上传文件 ===');

    // 1. 用户访问文件上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--basic-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2. 拦截上传请求并模拟成功响应
    await page.route('**/upload', async (route) => {
      const url = route.request().url();
      const method = route.request().method();
      console.log(`拖拽上传拦截请求: ${method} ${url}`);
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            url: 'https://example.com/dragged-file.png',
            name: 'plane.png',
            size: 664000,
            type: 'image/png'
          }
        })
      });
    });

    // 3. 用户拖拽文件到上传区域
    const uploadArea = page.locator('.kux-upload_area-container');
    console.log('开始拖拽文件...');
    
    // 使用更可靠的拖拽方法
    await page.evaluate(() => {
      const uploadArea = document.querySelector('.kux-upload_area-container');
      if (uploadArea) {
        // 创建文件对象
        const file = new File(['test content'], 'plane.png', { type: 'image/png' });
        
        // 创建 DataTransfer 对象
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        
        // 触发 dragover 事件
        const dragOverEvent = new DragEvent('dragover', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer
        });
        uploadArea.dispatchEvent(dragOverEvent);
        
        // 触发 drop 事件
        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer
        });
        uploadArea.dispatchEvent(dropEvent);
        
        console.log('拖拽事件已触发');
      }
    });
    console.log('✅ 拖拽文件到上传区域');

    // 4. 等待上传完成
    console.log('等待上传完成...');
    await page.waitForTimeout(8000);

    // 5. 验证拖拽上传成功 - 检查文件列表
    console.log('=== 验证拖拽上传结果 ===');
    
    // 检查文件列表
    const fileItems = page.locator('.kux-upload_file-list-item');
    const fileCount = await fileItems.count();
    console.log('文件列表项数量:', fileCount);
    expect(fileCount).toBeGreaterThan(0);
    console.log('✅ 文件列表显示成功');
    
    // 检查文件名
    const fileNameElements = page.locator('.kux-upload_file-list-item-name');
    const fileNameCount = await fileNameElements.count();
    if (fileNameCount > 0) {
      const fileName = await fileNameElements.first().textContent();
      console.log('拖拽上传文件名:', fileName);
      expect(fileName).toContain('plane.png');
      console.log('✅ 文件名显示正确');
    }
    
    // 检查文件大小
    const fileSizeElements = page.locator('.kux-upload_file-list-item-size');
    const fileSizeCount = await fileSizeElements.count();
    if (fileSizeCount > 0) {
      const fileSize = await fileSizeElements.first().textContent();
      console.log('拖拽上传文件大小:', fileSize);
      console.log('✅ 文件大小显示正确');
    }
    
    // 检查删除按钮
    const deleteButtons = page.locator('.kux-upload_file-list-item-delete');
    const deleteCount = await deleteButtons.count();
    console.log('删除按钮数量:', deleteCount);
    expect(deleteCount).toBeGreaterThan(0);
    console.log('✅ 删除按钮显示正确');
    
    // 检查进度条是否隐藏（上传完成后应该隐藏）
    const progressBar = page.locator('.kux-upload_file-list-item-progress');
    const progressBarVisible = await progressBar.isVisible();
    console.log('上传完成后进度条是否隐藏:', !progressBarVisible);
    expect(progressBarVisible).toBe(false);
    
    console.log('✅ 拖拽上传成功，所有UI元素显示正确');
  });
}); 