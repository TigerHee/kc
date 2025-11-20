/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import { Accordion, Box, NumberFormat } from '@kux/mui';

import Wrapper from './wrapper';

const { AccordionPanel } = Accordion;

const Doc = () => {
  return (
    <Box width={1000} style={{ marginLeft: 50 }}>
      <p>Normal:</p>
      <Accordion accordion>
        <AccordionPanel header="Habitant arcu tincidunt volutpat sit leo.">
          Amet ut viverra ultricies sit at et sit id lectus. Ultrices massa aliquet fusce mi arcu urna. Purus maecenas ante arcu diam quis penatibus non. In proin accumsan gravida sed suspendisse. Vitae phasellus eget bibendum in pulvinar a tellus. Tristique et tincidunt erat facilisis eu tristique arcu sapien. Ultricies mauris neque morbi ut vitae varius. Et phasellus integer molestie faucibus enim at amet. Et at augue libero ullamcorper sed nec. Mattis ullamcorper etiam massa auctor facilisi tempor. Quam sit lacus ultricies proin id eros gravida risus amet.
        </AccordionPanel>
        <AccordionPanel header="Nulla dolor eget a massa nec.">
          Amet ut viverra ultricies sit at et sit id lectus. Ultrices massa aliquet fusce mi arcu urna. Purus maecenas ante arcu diam quis penatibus non. In proin accumsan gravida sed suspendisse. Vitae phasellus eget bibendum in pulvinar a tellus. Tristique et tincidunt erat facilisis eu tristique arcu sapien. Ultricies mauris neque morbi ut vitae varius. Et phasellus integer molestie faucibus enim at amet. Et at augue libero ullamcorper sed nec. Mattis ullamcorper etiam massa auctor facilisi tempor. Quam sit lacus ultricies proin id eros gravida risus amet.
        </AccordionPanel>
        <AccordionPanel header="Convallis cursus elit montes aenean non turpis arcu tellus.">
          Amet ut viverra ultricies sit at et sit id lectus. Ultrices massa aliquet fusce mi arcu urna. Purus maecenas ante arcu diam quis penatibus non. In proin accumsan gravida sed suspendisse. Vitae phasellus eget bibendum in pulvinar a tellus. Tristique et tincidunt erat facilisis eu tristique arcu sapien. Ultricies mauris neque morbi ut vitae varius. Et phasellus integer molestie faucibus enim at amet. Et at augue libero ullamcorper sed nec. Mattis ullamcorper etiam massa auctor facilisi tempor. Quam sit lacus ultricies proin id eros gravida risus amet.
        </AccordionPanel>
      </Accordion>
      <br />
      <p>Dispersion:</p>
      <Accordion accordion dispersion>
        <AccordionPanel header="Habitant arcu tincidunt volutpat sit leo.">
          Amet ut viverra ultricies sit at et sit id lectus. Ultrices massa aliquet fusce mi arcu urna. Purus maecenas ante arcu diam quis penatibus non. In proin accumsan gravida sed suspendisse. Vitae phasellus eget bibendum in pulvinar a tellus. Tristique et tincidunt erat facilisis eu tristique arcu sapien. Ultricies mauris neque morbi ut vitae varius. Et phasellus integer molestie faucibus enim at amet. Et at augue libero ullamcorper sed nec. Mattis ullamcorper etiam massa auctor facilisi tempor. Quam sit lacus ultricies proin id eros gravida risus amet.
        </AccordionPanel>
        <AccordionPanel header="Nulla dolor eget a massa nec.">
          Amet ut viverra ultricies sit at et sit id lectus. Ultrices massa aliquet fusce mi arcu urna. Purus maecenas ante arcu diam quis penatibus non. In proin accumsan gravida sed suspendisse. Vitae phasellus eget bibendum in pulvinar a tellus. Tristique et tincidunt erat facilisis eu tristique arcu sapien. Ultricies mauris neque morbi ut vitae varius. Et phasellus integer molestie faucibus enim at amet. Et at augue libero ullamcorper sed nec. Mattis ullamcorper etiam massa auctor facilisi tempor. Quam sit lacus ultricies proin id eros gravida risus amet.
        </AccordionPanel>
        <AccordionPanel header="Convallis cursus elit montes aenean non turpis arcu tellus.">
          Amet ut viverra ultricies sit at et sit id lectus. Ultrices massa aliquet fusce mi arcu urna. Purus maecenas ante arcu diam quis penatibus non. In proin accumsan gravida sed suspendisse. Vitae phasellus eget bibendum in pulvinar a tellus. Tristique et tincidunt erat facilisis eu tristique arcu sapien. Ultricies mauris neque morbi ut vitae varius. Et phasellus integer molestie faucibus enim at amet. Et at augue libero ullamcorper sed nec. Mattis ullamcorper etiam massa auctor facilisi tempor. Quam sit lacus ultricies proin id eros gravida risus amet.
        </AccordionPanel>
      </Accordion>
      <br />
      <p>Dispersion Size Small:</p>
      <Accordion accordion dispersion size="small">
        <AccordionPanel header="Habitant arcu tincidunt volutpat sit leo.">
          Amet ut viverra ultricies sit at et sit id lectus. Ultrices massa aliquet fusce mi arcu urna. Purus maecenas ante arcu diam quis penatibus non. In proin accumsan gravida sed suspendisse. Vitae phasellus eget bibendum in pulvinar a tellus. Tristique et tincidunt erat facilisis eu tristique arcu sapien. Ultricies mauris neque morbi ut vitae varius. Et phasellus integer molestie faucibus enim at amet. Et at augue libero ullamcorper sed nec. Mattis ullamcorper etiam massa auctor facilisi tempor. Quam sit lacus ultricies proin id eros gravida risus amet.
        </AccordionPanel>
        <AccordionPanel header="Nulla dolor eget a massa nec.">
          Amet ut viverra ultricies sit at et sit id lectus. Ultrices massa aliquet fusce mi arcu urna. Purus maecenas ante arcu diam quis penatibus non. In proin accumsan gravida sed suspendisse. Vitae phasellus eget bibendum in pulvinar a tellus. Tristique et tincidunt erat facilisis eu tristique arcu sapien. Ultricies mauris neque morbi ut vitae varius. Et phasellus integer molestie faucibus enim at amet. Et at augue libero ullamcorper sed nec. Mattis ullamcorper etiam massa auctor facilisi tempor. Quam sit lacus ultricies proin id eros gravida risus amet.
        </AccordionPanel>
        <AccordionPanel header="Convallis cursus elit montes aenean non turpis arcu tellus.">
          Amet ut viverra ultricies sit at et sit id lectus. Ultrices massa aliquet fusce mi arcu urna. Purus maecenas ante arcu diam quis penatibus non. In proin accumsan gravida sed suspendisse. Vitae phasellus eget bibendum in pulvinar a tellus. Tristique et tincidunt erat facilisis eu tristique arcu sapien. Ultricies mauris neque morbi ut vitae varius. Et phasellus integer molestie faucibus enim at amet. Et at augue libero ullamcorper sed nec. Mattis ullamcorper etiam massa auctor facilisi tempor. Quam sit lacus ultricies proin id eros gravida risus amet.
        </AccordionPanel>
      </Accordion>
    </Box>
  );
};

export default ({ children }) => {
  return (
    <Wrapper>
      <Doc>{children}</Doc>
    </Wrapper>
  );
};
