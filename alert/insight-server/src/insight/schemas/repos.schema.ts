import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReposDocument = Repos & Document;
// 示例保留
/**
 * "slug": "for-test",
      "id": 5360,
      "name": "for-test",
      "description": "全部权限授予的一个测试仓库 Owner: Chrise Zhao",
      "hierarchyId": "aca3e0dde0606ccdbd4e",
      "scmId": "git",
      "state": "AVAILABLE",
      "statusMessage": "Available",
      "forkable": true,
      "project": {
          "key": "KUCW",
          "id": 113,
          "name": "kucoin-web-FREZEN",
          "description": "归档WEB的工程组",
          "public": false,
          "type": "NORMAL",
          "links": {
              "self": [
                  {
                      "href": "https://bitbucket.kucoin.net/projects/KUCW"
                  }
              ]
          }
      },
      "public": false,
      "links": {
          "clone": [
              {
                  "href": "ssh://git@bitbucket.kucoin.net/kucw/for-test.git",
                  "name": "ssh"
              },
              {
                  "href": "https://bitbucket.kucoin.net/scm/kucw/for-test.git",
                  "name": "http"
              }
          ],
          "self": [
              {
                  "href": "https://bitbucket.kucoin.net/projects/KUCW/repos/for-test/browse"
              }
          ]
      }
  */
@Schema({ collection: 'repos' })
export class Repos {
  // @Prop({ required: false, type: Types.ObjectId, ref: User.name })
  // owner: Types.ObjectId | UserDocument;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: 'KUC' })
  group: string;

  @Prop({ type: Date, default: null })
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  // bitbucket repo fields

  @Prop({ required: true })
  slug: string;
  @Prop({ required: true })
  id: number;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  hierarchyId: string;
  @Prop({ required: true })
  scmId: string;
  @Prop({ required: true })
  state: string;
  @Prop({ required: true, default: 'Available' })
  statusMessage: string;
  @Prop({ required: true, default: false })
  forkable: boolean;
  @Prop({ required: true, default: false })
  public: boolean;
  @Prop({
    required: true,
    type: Object,
    default: {
      key: '',
      id: 0,
      name: '',
      description: '',
      public: false,
      type: 'NORMAL',
      links: {
        self: [
          {
            href: '',
          },
        ],
      },
    },
  })
  project: object;
  @Prop({
    required: true,
    type: Object,
    default: {
      clone: [
        {
          href: '',
          name: '',
        },
      ],
      self: [
        {
          href: '',
        },
      ],
    },
  })
  links: object;
}
export const ReposSchema = SchemaFactory.createForClass(Repos);
