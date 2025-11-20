interface WikiErrors {
  title: string;
  content: string | string[];
}

// {
//   type: 'known',
//   accountId: '63842efd3c26ca7fa0d3ee31',
//   accountType: 'atlassian',
//   email: 'mike.liu@flsdex.com',
//   publicName: 'mike.liu',
//   profilePicture: {
//     path: '/wiki/aa-avatar/63842efd3c26ca7fa0d3ee31',
//     width: 48,
//     height: 48,
//     isDefault: false
//   },
//   displayName: 'Mike Liu',
//   isExternalCollaborator: false,
//   isGuest: false,
//   locale: 'zh_CN',
//   accountStatus: 'active',
//   _expandable: { operations: '', personalSpace: '' },
//   _links: {
//     self: 'https://k-devdoc.atlassian.net/wiki/rest/api/user?accountId=63842efd3c26ca7fa0d3ee31',
//     base: 'https://k-devdoc.atlassian.net/wiki',
//     context: '/wiki'
//   }
// }
interface WikiUser {
  type: string;
  accountId: string;
  accountType: string;
  email: string;
  publicName: string;
  profilePicture: {
    path: string;
    width: number;
    height: number;
    isDefault: boolean;
  };
  displayName: string;
  isExternalCollaborator: boolean;
  isGuest: boolean;
  locale: string;
  accountStatus: string;
  _expandable: {
    operations: string;
    personalSpace: string;
  };
  _links: {
    self: string;
    base: string;
    context: string;
  };
}
// "contentAnalyticsViewsByUser": {
//   "pageViews": [
//       {
//           "userProfile": {
//               "displayName": "Mike Liu",
//               "id": "63842efd3c26ca7fa0d3ee31",
//               "photos": [
//                   {
//                       "value": "https://secure.gravatar.com/avatar/d59c0d767d1cd9fa2653bc4ed0934f55?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FML-4.png",
//                       "isPrimary": true,
//                       "__typename": "AtlassianUserPhoto"
//                   }
//               ],
//               "isActive": true,
//               "confluence": {
//                   "permissionType": "INTERNAL",
//                   "__typename": "ConfluenceUser"
//               },
//               "__typename": "AtlassianUser"
//           },
//           "views": 1,
//           "lastViewedAt": "2024-02-27T06:57:45.606Z",
//           "lastVersionViewedNumber": 7,
//           "lastVersionViewedUrl": "https://k-devdoc.atlassian.net/wiki/pages/viewpage.action?pageId=483920152",
//           "__typename": "ContentAnalyticsPageViewInfo"
//       },
//     }
//   ]
// }

interface PageViews {
  userProfile: {
    displayName: string;
    id: string;
    photos: {
      value: string;
      isPrimary: boolean;
    }[];
    isActive: boolean;
    confluence: {
      permissionType: string;
    };
  };
  views: number;
  lastViewedAt: string;
  lastVersionViewedNumber: number;
  lastVersionViewedUrl: string;
}

interface ContentAnalyticsViewsByUser {
  pageViews: PageViews[];
}

export { WikiErrors, WikiUser, ContentAnalyticsViewsByUser, PageViews };
