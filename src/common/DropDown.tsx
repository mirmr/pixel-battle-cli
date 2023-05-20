import { ReactElement, ReactNode, forwardRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
});

const DropDownContainer = styled.div({
  position: 'relative',
});

const StyledDropDown = styled.div<{ align: 'left' | 'center' | 'right' }>(
  (props) => ({
    position: 'absolute',
    width: 'fit-content',
    top: '0px',
    ...(props.align === 'center'
      ? {
          left: '50%',
          transform: 'translateX(-50%)',
        }
      : {
          [props.align]: '0px',
        }),
  }),
);

const DropDown = forwardRef<
  HTMLDivElement,
  {
    button: ReactElement;
    children: ReactNode;
    align?: 'left' | 'center' | 'right' | undefined;
    show: boolean;
  }
>(function DropDown({ button, children, align = 'center', show }, ref) {
  return (
    <Wrapper ref={ref}>
      {button}
      {show && (
        <DropDownContainer>
          <StyledDropDown align={align}>{children}</StyledDropDown>
        </DropDownContainer>
      )}
    </Wrapper>
  );
});

export default DropDown;
