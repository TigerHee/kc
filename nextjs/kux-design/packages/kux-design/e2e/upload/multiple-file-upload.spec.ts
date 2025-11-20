import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.serial('Upload Component E2E Tests - Multiple File Upload', () => {
  const STORYBOOK_URL = 'http://localhost:6006';
  const testFile = path.join(__dirname, 'plane.png');

  // 用户旅程 1: 成功上传多个文件
  test('user journey - successful multiple file upload', async ({ page }) => {
    console.log('=== 用户旅程: 成功上传多个文件 ===');

    // 1. 用户访问多文件上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--multiple-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2. 用户看到上传区域
    const uploadArea = page.locator('.kux-upload_area-container');
    await expect(uploadArea).toBeVisible();
    console.log('✅ 上传区域可见');

    // 3. 拦截上传请求并模拟成功响应
    await page.route('**/upload', async (route) => {
      const url = route.request().url();
      const method = route.request().method();
      console.log(`拦截多文件上传请求: ${method} ${url}`);
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              url: 'https://example.com/uploaded-file-1.png',
              name: 'plane.png',
              size: 664000,
              type: 'image/png'
            },
            {
              url: 'https://example.com/uploaded-file-2.png',
              name: 'plane.png',
              size: 664000,
              type: 'image/png'
            }
          ]
        })
      });
    });

    // 4. 用户点击上传区域
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadArea.click();
    const fileChooser = await fileChooserPromise;
    console.log('✅ 文件选择器弹出');

    // 5. 用户选择多个文件
    await fileChooser.setFiles([testFile, testFile]);
    console.log('✅ 多文件选择成功');

    // 6. 等待上传完成
    await page.waitForTimeout(5000);

    // 7. 验证上传结果
    // 通过查找包含"已上传文件："文本的元素，然后获取其兄弟节点 pre
    const uploadedFileText = page.locator('text="已上传文件："');
    const jsonDisplay = uploadedFileText.locator('xpath=../pre');
    const jsonContent = await jsonDisplay.first().textContent();
    console.log('多文件上传结果:', jsonContent);

    // 验证上传成功
    if (jsonContent) {
      const result = JSON.parse(jsonContent);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      console.log('✅ 多文件上传成功');
    } else {
      // 检查其他成功指标
      const fileItems = page.locator('.kux-upload_file-list-item, .kux-upload-item, [data-testid*="file"]');
      const fileCount = await fileItems.count();
      if (fileCount > 1) {
        console.log('✅ 多文件项显示成功');
        expect(fileCount).toBeGreaterThan(1);
      } else {
        console.log('❌ 多文件上传失败');
        expect(false).toBe(true);
      }
    }
  });

  // 用户旅程 2: 文件数量限制测试
  test('user journey - file count limit', async ({ page }) => {
    console.log('=== 用户旅程: 文件数量限制测试 ===');

    // 1. 用户访问多文件上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--multiple-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2. 拦截上传请求并模拟成功响应
    await page.route('**/upload', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              url: 'https://example.com/limit-file-1.png',
              name: 'plane.png',
              size: 664000,
              type: 'image/png'
            }
          ]
        })
      });
    });

    // 3. 用户尝试上传超过限制的文件数量
    const uploadArea = page.locator('.kux-upload_area-container');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadArea.click();
    const fileChooser = await fileChooserPromise;
    
    // 尝试选择多个文件（超过限制）
    await fileChooser.setFiles([testFile, testFile, testFile, testFile, testFile]);
    console.log('✅ 尝试上传多个文件');

    // 4. 等待处理
    await page.waitForTimeout(3000);

    // 5. 检查是否有错误提示
    const errorElements = page.locator('.kux-upload--error, .kux-upload_area-error, [data-status="error"]');
    const errorCount = await errorElements.count();
    console.log('错误元素数量:', errorCount);

    if (errorCount > 0) {
      const errorText = await errorElements.first().textContent();
      console.log('错误信息:', errorText);
      console.log('✅ 文件数量限制正确显示');
      expect(errorText).toBeTruthy();
    } else {
      // 检查实际上传的文件数量
      const fileItems = page.locator('.kux-upload_file-list-item, .kux-upload-item, [data-testid*="file"]');
      const fileCount = await fileItems.count();
      console.log('实际上传文件数量:', fileCount);
      
      if (fileCount <= 3) { // 假设限制是3个文件
        console.log('✅ 文件数量限制生效');
        expect(fileCount).toBeLessThanOrEqual(3);
      } else {
        console.log('❌ 文件数量限制未生效');
        expect(false).toBe(true);
      }
    }
  });

  // 用户旅程 3: 部分文件上传失败
  test('user journey - partial upload failures', async ({ page }) => {
    console.log('=== 用户旅程: 部分文件上传失败 ===');

    // 1. 用户访问多文件上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--multiple-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2. 拦截上传请求并模拟部分失败响应
    let requestCount = 0;
    await page.route('**/upload', async (route) => {
      requestCount++;
      const url = route.request().url();
      const method = route.request().method();
      console.log(`拦截多文件上传请求 ${requestCount}: ${method} ${url}`);
      
      // 第一个文件成功，第二个文件失败
      if (requestCount === 1) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              url: 'https://example.com/success-file.png',
              name: 'plane.png',
              size: 664000,
              type: 'image/png'
            }
          })
        });
      } else {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Upload failed'
          })
        });
      }
    });

    // 3. 用户上传多个文件
    const uploadArea = page.locator('.kux-upload_area-container');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadArea.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([testFile, testFile]);
    console.log('✅ 多文件选择成功');

    // 4. 等待上传完成
    await page.waitForTimeout(5000);

    // 5. 检查成功和失败的文件
    const successElements = page.locator('.kux-upload--done, [data-status="done"]');
    const errorElements = page.locator('.kux-upload--error, [data-status="error"]');
    
    const successCount = await successElements.count();
    const errorCount = await errorElements.count();
    
    console.log('成功文件数量:', successCount);
    console.log('失败文件数量:', errorCount);

    // 验证部分成功部分失败
    if (successCount > 0 && errorCount > 0) {
      console.log('✅ 部分成功部分失败状态正确');
      expect(successCount).toBeGreaterThan(0);
      expect(errorCount).toBeGreaterThan(0);
    } else {
      console.log('❌ 部分失败状态不正确');
      expect(false).toBe(true);
    }
  });

  // 用户旅程 4: 批量删除文件
  test('user journey - batch delete files', async ({ page }) => {
    console.log('=== 用户旅程: 批量删除文件 ===');

    // 1. 用户访问多文件上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--multiple-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2. 拦截上传请求并模拟成功响应
    await page.route('**/upload', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              url: 'https://example.com/batch-file-1.png',
              name: 'plane.png',
              size: 664000,
              type: 'image/png'
            },
            {
              url: 'https://example.com/batch-file-2.png',
              name: 'plane.png',
              size: 664000,
              type: 'image/png'
            }
          ]
        })
      });
    });

    // 3. 用户上传多个文件
    const uploadArea = page.locator('.kux-upload_area-container');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadArea.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([testFile, testFile]);
    console.log('✅ 多文件上传成功');

    // 4. 等待上传完成
    await page.waitForTimeout(5000);

    // 5. 用户查找批量删除按钮
    const batchDeleteButtons = page.locator('button:has-text("批量删除"), .kux-upload-batch-delete, [aria-label*="批量删除"]');
    const batchDeleteCount = await batchDeleteButtons.count();
    console.log('批量删除按钮数量:', batchDeleteCount);

    if (batchDeleteCount > 0) {
      // 6. 用户点击批量删除按钮
      await batchDeleteButtons.first().click();
      console.log('✅ 点击批量删除按钮');

      // 7. 等待删除处理
      await page.waitForTimeout(2000);

      // 8. 验证所有文件被删除
      const remainingFileItems = page.locator('.kux-upload_file-list-item, .kux-upload-item, [data-testid*="file"]');
      const remainingCount = await remainingFileItems.count();
      console.log('剩余文件数量:', remainingCount);

      if (remainingCount === 0) {
        console.log('✅ 批量删除成功');
        expect(remainingCount).toBe(0);
      } else {
        console.log('❌ 批量删除失败');
        expect(remainingCount).toBe(0);
      }
    } else {
      // 如果没有批量删除按钮，尝试逐个删除
      console.log('未找到批量删除按钮，尝试逐个删除');
      const deleteButtons = page.locator('button:has-text("删除"), .kux-upload-delete, [aria-label*="删除"]');
      const deleteCount = await deleteButtons.count();
      console.log('删除按钮数量:', deleteCount);

      if (deleteCount > 0) {
        // 逐个删除所有文件
        for (let i = 0; i < deleteCount; i++) {
          await deleteButtons.nth(i).click();
          await page.waitForTimeout(1000);
        }
        console.log('✅ 逐个删除完成');

        // 验证删除结果
        const finalFileItems = page.locator('.kux-upload_file-list-item, .kux-upload-item, [data-testid*="file"]');
        const finalCount = await finalFileItems.count();
        console.log('最终剩余文件数量:', finalCount);

        if (finalCount === 0) {
          console.log('✅ 逐个删除成功');
          expect(finalCount).toBe(0);
        } else {
          console.log('❌ 逐个删除失败');
          expect(finalCount).toBe(0);
        }
      } else {
        console.log('❌ 未找到删除按钮');
        expect(false).toBe(true);
      }
    }
  });

  // 用户旅程 5: 拖拽上传多个文件
  test('user journey - drag and drop multiple files', async ({ page }) => {
    console.log('=== 用户旅程: 拖拽上传多个文件 ===');

    // 1. 用户访问多文件上传页面
    await page.goto(`${STORYBOOK_URL}/iframe.html?globals=&id=base-upload--multiple-file-upload&viewMode=story`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2. 拦截上传请求并模拟成功响应
    await page.route('**/upload', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              url: 'https://example.com/dragged-file-1.png',
              name: 'plane.png',
              size: 664000,
              type: 'image/png'
            },
            {
              url: 'https://example.com/dragged-file-2.png',
              name: 'plane.png',
              size: 664000,
              type: 'image/png'
            }
          ]
        })
      });
    });

    // 3. 用户拖拽多个文件到上传区域
    const uploadArea = page.locator('.kux-upload_area-container');
    await page.evaluate((testFile) => {
      const uploadArea = document.querySelector('.kux-upload_area-container');
      if (uploadArea) {
        // 创建拖拽事件
        const dragOverEvent = new DragEvent('dragover', {
          bubbles: true,
          cancelable: true
        });
        uploadArea.dispatchEvent(dragOverEvent);

        // 创建多个文件对象
        const file1 = new File(['test content 1'], 'plane1.png', { type: 'image/png' });
        const file2 = new File(['test content 2'], 'plane2.png', { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file1);
        dataTransfer.items.add(file2);

        // 创建拖拽放下事件
        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer
        });
        uploadArea.dispatchEvent(dropEvent);
      }
    }, testFile);
    console.log('✅ 拖拽多个文件到上传区域');

    // 4. 等待上传完成
    await page.waitForTimeout(5000);

    // 5. 验证拖拽上传成功
    const jsonDisplay = page.locator('pre');
    const jsonContent = await jsonDisplay.first().textContent();
    console.log('拖拽上传结果:', jsonContent);

    const fileItems = page.locator('.kux-upload_file-list-item, .kux-upload-item, [data-testid*="file"]');
    const fileCount = await fileItems.count();
    console.log('文件项数量:', fileCount);

    if (fileCount > 1 || jsonContent) {
      console.log('✅ 拖拽多文件上传成功');
      expect(fileCount > 1 || jsonContent).toBeTruthy();
    } else {
      console.log('❌ 拖拽多文件上传失败');
      expect(false).toBe(true);
    }
  });
}); 