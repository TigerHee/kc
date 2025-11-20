/**
 * Owner: iron@kupotech.com
 */
import path from 'path';
import fs from 'fs';
const manifestInfo = {};
function OutputManifest(opts = { dir: '/', currentVersion: '' }) {
    return {
        name: 'rollup-plugin-output-manifest',
        generateBundle(outputOptions, bundle) {
            const targetDir = opts.dir;
            Object.entries(bundle)
                .filter(([key, bundleInfo]) => bundleInfo.isEntry)
                .forEach(([key, bundleInfo]) => {
                    manifestInfo[bundleInfo.name] = outputOptions.dir.replace(targetDir, '') + bundleInfo.fileName
                    if (bundleInfo.name === 'main') {
                        manifestInfo[`${bundleInfo.name}-css`] = outputOptions.dir.replace(targetDir, '') + 'remote-app.css'
                    }
                })
            const workspace = process.cwd();
            const filePath = path.resolve(workspace, targetDir, 'manifest' + '.' + opts.currentVersion + '.json');
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.writeFileSync(filePath, `${JSON.stringify(manifestInfo)}`);
            return null;
        }
    };
}
export default OutputManifest;