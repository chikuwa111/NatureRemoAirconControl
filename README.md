# NatureRemoAirconControl

Slack の slash command から Post リクエストを受けて NatureRemo のシグナルを送信またはその予約をする Google Apps Script プロジェクト

## 使い方

### 事前準備
- Slack の slash command が使える App
- NatureRemo の OAuth2 Token
- NatureRemo の 操作したいデバイス ( エアコンに限りません ) の on, off 相当の signal id

### デプロイ
- プロジェクトの作成
- デプロイ ( `.clasp.sample.json` を使ってください )
- スクリプトのプロパティを設定
  - token: string
  - powerOnSignalId: string
  - powerOffSignalId: string
- ウェブアプリケーションとして導入
- cron関数の定期実行トリガーを設定する ( 私は15分間隔にしました )
- slash command の Request URL を設定

### slash command ( 例: `/aircon` )
- 起動 `/aircon on`
- 停止 `/aircon off`
- 起動の予約 `/aircon on 2019-07-22T23:00`
- 停止の予約 `/aircon off 2019-07-22T23:00`
- 予約の確認 `/aircon list`
- 予約の削除 `/aircon reset`
