import Emoji from 'node-emoji';
import MarkdownIt from 'markdown-it';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e4e4e6;
  color: #2a3b4d;
  display: flex;
  border-radius: 4px;
  padding: 18px;
  font-size: 15px;
  align-items: center;
`;

const Avatar = styled.div`
  flex: 1;
  margin-right: 18px;
`;

const AvatarImage = styled.img`
  width: 100%;
  vertical-align: middle;
  border-radius: 50%;
`;

const Content = styled.div`
  flex: 3;
  line-height: 1.5;
`;

const Author = styled.div`
  margin-top: 12px;
  font-weight: bold;
  text-align: right;
`;

const Quote = ({ avatar, quote, author, ...props }) => {
  const html = Emoji.emojify((new MarkdownIt()).render(quote));

  return (
    <Card {...props}>
      <Avatar>
        <AvatarImage src={avatar} alt='' />
      </Avatar>
      <Content>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <Author>{author}</Author>
      </Content>
    </Card>
  );
};

export default Quote;
