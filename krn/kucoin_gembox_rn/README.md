# 发版前注意事项

#### 若此项目本次迭代需要升级 krn_base_bundle 版本，请保证这次 krn_base_bundle 发布要早于业务包的发布。

#### 请确认 krn_base_bundle 的依赖是否修改为正式版，beta 版将无法进行线上发布。

#### 请确认 package.json 的 appVersion 版本，若本次发版依赖了一些新的原生能力（如依赖了新增的桥或原生的组件），须将此版本号修改为对应 app 版本。其他情况不建议升级 appVersion 以保证更多的用户能更新到。
