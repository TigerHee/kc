import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickyContainer, StickyItem } from './index';
import React, { useState } from 'react';

const componentMeta = {
  title: 'base/Sticky',
  component: StickyContainer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    defaultMode: {
      control: 'select',
      options: ['replace', 'stack', 'none'],
      defaultValue: 'stack',
      description: 'Sticky behavior mode'
    },
    offsetTop: {
      control: 'number',
      defaultValue: 0,
      description: 'Offset from top of viewport'
    }
  },
} satisfies Meta<typeof StickyContainer>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// Create a component to demonstrate with colored sticky items
const DemoContent = ({mode}: {mode: 'replace' | 'stack' | 'none'}) => {
  const colors = ['#3498db', '#e74c3c', '#2ecc71'];
  
  return (
    <>
      {[1, 2, 3].map((num, i) => (
        <React.Fragment key={num}>
          <StickyItem
            style={{ backgroundColor: colors[i] }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors[i] }}>
              <h3 style={{ margin: 0 }}>Sticky Header {num}</h3>
              <div>Mode: {mode}</div>
            </div>
          </StickyItem>
          <div 
            style={{ 
              height: num === 3 ? '800px' : '300px', 
              background: `${colors[i]}22`, 
              padding: '20px',
              borderLeft: `4px solid ${colors[i]}`
            }}
          >
            <h4>Content Section {num}</h4>
            <p>Scroll to see sticky behavior in action. This section is {num === 3 ? 'taller' : 'standard'} height.</p>
            
            {num === 2 && (
              <div style={{ marginTop: '20px' }}>
                <p>This middle section has some extra content to demonstrate scrolling.</p>
                <ul>
                  {Array(5).fill(0).map((_, i) => (
                    <li key={i}>Item {i + 1} - to add some content height</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

// Stack Mode Story
export const StackMode: Story = {
  args: {
    defaultMode: 'stack',
    offsetTop: 0,
  },
  render: (args) => {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif'}}>
        <header style={{ padding: '20px', background: '#333', color: 'white', textAlign: 'center' }}>
          <h1>Stack Mode Demo</h1>
          <p>Elements will stack on top of each other as you scroll</p>
        </header>
        
        <StickyContainer 
          {...args} 
          style={{maxWidth: '800px', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)', background: 'white'}}
        >
          <DemoContent mode={args.defaultMode!} />
        </StickyContainer>
        
        <footer style={{ padding: '40px', background: '#333', color: 'white', textAlign: 'center' }}>
          <p>End of demo</p>
        </footer>
      </div>
    );
  },
};

// Replace Mode Story
export const ReplaceMode: Story = {
  args: {
    defaultMode: 'replace',
    offsetTop: 0,
  },
  render: (args) => {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ padding: '20px', background: '#333', color: 'white', textAlign: 'center' }}>
          <h1>Replace Mode Demo</h1>
          <p>Only the most recently scrolled sticky element remains visible</p>
        </header>
        
        <StickyContainer 
          {...args} 
          style={{maxWidth: '800px', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)', background: 'white'}}
        >
          <DemoContent mode={args.defaultMode!} />
        </StickyContainer>
        
        <footer style={{ padding: '40px', background: '#333', color: 'white', textAlign: 'center' }}>
          <p>End of demo</p>
        </footer>
      </div>
    );
  },
};

// Add a controlled component example to better demonstrate mode switching
export const ControlledMode: Story = {
  render: (args) => {
    const [mode, setMode] = useState<'replace' | 'stack' | 'none'>('stack');
    
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ 
          padding: '15px 20px', 
          background: '#333', 
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h2 style={{ margin: 0 }}>Sticky Component</h2>
            <div>
              <span style={{ marginRight: '10px' }}>Current Mode: <strong>{mode}</strong></span>
              <button 
                onClick={() => setMode('stack')} 
                disabled={mode === 'stack'}
                style={{ 
                  padding: '5px 10px',
                  backgroundColor: mode === 'stack' ? '#555' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '5px',
                  cursor: mode === 'stack' ? 'default' : 'pointer'
                }}
              >
                Stack
              </button>
              <button 
                onClick={() => setMode('replace')} 
                disabled={mode === 'replace'}
                style={{ 
                  padding: '5px 10px',
                  backgroundColor: mode === 'replace' ? '#555' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '5px',
                  cursor: mode === 'replace' ? 'default' : 'pointer'
                }}
              >
                Replace
              </button>
              <button 
                onClick={() => setMode('none')} 
                disabled={mode === 'none'}
                style={{ 
                  padding: '5px 10px',
                  backgroundColor: mode === 'none' ? '#555' : '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: mode === 'none' ? 'default' : 'pointer'
                }}
              >
                None
              </button>
            </div>
          </div>
        </header>
        
        <div style={{ padding: '20px' }}>
          <StickyContainer 
            defaultMode={mode}
            offsetTop={args.offsetTop || 58}
            style={{
              maxWidth: '800px', 
              margin: '0 auto', 
              boxShadow: '0 0 10px rgba(0,0,0,0.1)', 
              background: 'white'
            }}
          >
            <DemoContent mode={mode} />
          </StickyContainer>
        </div>
      </div>
    );
  }
};

// New Story for testing offsetTop
export const OffsetTopTest: Story = {
  args: {
    defaultMode: 'stack', // Or 'replace', as preferred for testing
    offsetTop: 60, // Default offset for this story
  },
  render: (args) => {
    const headerHeight = args.offsetTop || 0; // Use the offsetTop from args for the mock header

    return (
      <div style={{ fontFamily: 'system-ui, sans-serif' }}>
        {/* Mock Fixed Header */}
        <div style={{
          height: `${headerHeight}px`,
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed', // Make it fixed to simulate a real header
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2000, // Ensure it's above sticky items if they have lower z-index
          borderBottom: '2px solid black'
        }}>
          Mock Fixed Header ({headerHeight}px). Sticky items should appear below this.
        </div>

        {/* Spacer to push content below the fixed header */}
        <div style={{ height: `${headerHeight}px` }} />

        <div style={{ padding: '20px' }}>
          <p>Scroll down to see items stick. Current offsetTop: {args.offsetTop}px</p>
          <StickyContainer
            {...args} // Pass all args, including the controlled offsetTop
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              background: 'white',
              border: '1px solid #ccc'
            }}
          >
            <DemoContent mode={args.defaultMode!} />
          </StickyContainer>
        </div>
        <footer style={{ padding: '40px', background: '#333', color: 'white', textAlign: 'center', marginTop: '50px' }}>
          <p>End of demo</p>
        </footer>
      </div>
    );
  }
};

// New Story for testing container visibility
export const ContainerOutOfViewTest: Story = {
  args: {
    defaultMode: 'stack',
    offsetTop: 0,
  },
  render: (args) => {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ padding: '20px', background: '#333', zIndex: 500, height: 190, position: 'fixed', top: 0, width: '100%', color: 'white', textAlign: 'center' }}>
          <h1>Container Out Of View Test</h1>
          <p>Scroll down. Sticky items should only appear when the container is visible.</p>
          <p>Then, scroll further until the container is off-screen again.</p>
        </header>

        <div style={{ height: '150vh', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '2px dashed #ccc' }}>
          <p style={{fontSize: '24px', color: '#555'}}>Tall content BEFORE the StickyContainer. Scroll down...</p>
        </div>
        <div>
        <StickyContainer 
          {...args} 
          offsetTop={args.offsetTop || 190}
          style={{
            maxWidth: '800px', 
            margin: '20px auto', 
            boxShadow: '0 0 10px rgba(0,0,0,0.1)', 
            background: 'white',
            border: '2px solid blue', // To easily identify the container
            padding: '10px'
          }}
        >
          <DemoContent mode={args.defaultMode!} />
        </StickyContainer>
        </div>
        
        <div style={{ height: '150vh', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '2px dashed #ccc' }}>
          <p style={{fontSize: '24px', color: '#555'}}>Tall content AFTER the StickyContainer. Scroll up/down...</p>
        </div>

        <footer style={{ padding: '40px', background: '#333', color: 'white', textAlign: 'center' }}>
          <p>End of demo</p>
        </footer>
      </div>
    );
  },
};
