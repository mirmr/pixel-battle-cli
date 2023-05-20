import { FC } from 'react';
import styled from 'styled-components';

const StyledLoading = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

const Text = styled.p((props) => ({
  fontSize: props.theme.fontSizes.large,
}));

const Loading: FC = () => {
  return (
    <StyledLoading>
      <Text>Загрузка...</Text>
    </StyledLoading>
  );
};

export default Loading;
