export enum WebhookEventEnum {
  /**
   * 该事件在一个 Pull Request 被合并时触发。这表示代码已经审查，并且合并到了目标分支中。
   * 通常用于通知其他系统或服务，比如 CI/CD 管道，可以在此时进行后续操作。
   */
  EVENT_PR_MERGED = 'pr:merged',
  /**
   * 当一个新的 Pull Request 被创建时，此事件会触发。
   * 这通常用于评审通知，可以用来初始化评审流程或进行相关的自动测试。
   */
  EVENT_PR_OPENED = 'pr:opened',
  /**
   * 当一个 Pull Request 的源分支（也称为从分支）发生更新时触发。
   * 也就是说，如果有新的提交被推送到源分支，便会触发此事件。
   * 这常用于更新 Pull Request 评审内容，或者自动重新运行测试。
   */
  EVENT_PR_FROM_REF_UPDATED = 'pr:from_ref_updated',
  /**
   * 此事件在仓库引用（如分支或标签）发生变化时触发。
   * 比如，当推送新的提交、更改分支或标签时，都会引发这个事件。
   * 它可以用于跟踪所有与分支和标签相关的活动。
   */
  EVENT_REFS_CHANGED = 'repo:refs_changed',
}
