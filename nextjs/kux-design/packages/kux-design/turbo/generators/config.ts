import type { PlopTypes } from '@turbo/gen'
import { execSync } from 'child_process'

// get git email config
function getGitEmail() {  
  return execSync('git config user.email').toString().trim();
}

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // A simple generator to add a new React component to the internal UI library
  plop.setGenerator('react-component', {
    description: 'Adds a new react component',
    prompts: [
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name(CamelCase):',
      },
    ],
    actions: (data) =>{
      data!.email = getGitEmail();
      const actionList = [
        {
          type: 'add',
          path: 'src/components/{{kebabCase componentName}}/index.tsx',
          templateFile: 'templates/component.hbs',
        },
        {
          type: 'add',
          path: 'src/components/{{kebabCase componentName}}/stories.tsx',
          templateFile: 'templates/stories.hbs',
        },
        {
          type: 'add',
          path: 'src/components/{{kebabCase componentName}}/readme.mdx',
          templateFile: 'templates/readme.hbs',
        },
        {
          type: 'add',
          path: 'src/components/{{kebabCase componentName}}/style.scss',
          templateFile: 'templates/style.scss.hbs',
        },

        {
          type: 'append',
          path: 'src/components/index.ts',
          template: 'export * from \'./{{kebabCase componentName}}\''
        }
      ]
      return actionList;
    }
  });
}
