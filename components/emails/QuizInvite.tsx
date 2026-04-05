import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from '@react-email/components'

interface QuizInviteEmailProps {
  quizUrl: string
  email: string
}

export function QuizInviteEmail({ quizUrl, email }: QuizInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Storytime subscription is confirmed — complete your personalization quiz</Preview>
      <Body style={{ backgroundColor: '#fdf8f0', fontFamily: 'Georgia, serif', margin: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ backgroundColor: '#fff9f0', border: '1px solid #e8d5b7', borderRadius: '12px', padding: '40px' }}>
            <Heading style={{ color: '#8b4513', fontSize: '28px', marginBottom: '8px' }}>
              📖 Welcome to Storytime!
            </Heading>
            <Text style={{ color: '#8b7355', fontSize: '16px', marginTop: 0 }}>
              Payment confirmed for {email}
            </Text>

            <Hr style={{ borderColor: '#e8d5b7', margin: '24px 0' }} />

            <Text style={{ color: '#2c1810', fontSize: '16px', lineHeight: '1.6' }}>
              Your subscription is active! Before we send your first story, we need to know a little about you — so we can make it <em>truly</em> yours.
            </Text>

            <Text style={{ color: '#2c1810', fontSize: '16px', lineHeight: '1.6' }}>
              The quiz takes about 2 minutes and covers:
            </Text>

            <ul style={{ color: '#2c1810', fontSize: '15px', lineHeight: '2' }}>
              <li>Your preferred name for the story&apos;s protagonist</li>
              <li>The genres and themes you enjoy most</li>
              <li>Your reading preferences</li>
            </ul>

            <div style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={quizUrl}
                style={{
                  backgroundColor: '#8b4513',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontFamily: 'Georgia, serif',
                  textDecoration: 'none',
                }}
              >
                Take Your Personalization Quiz →
              </Button>
            </div>

            <Text style={{ color: '#8b7355', fontSize: '14px' }}>
              Or copy this link into your browser:
              <br />
              <span style={{ color: '#8b4513' }}>{quizUrl}</span>
            </Text>

            <Hr style={{ borderColor: '#e8d5b7', margin: '24px 0' }} />

            <Text style={{ color: '#8b7355', fontSize: '13px' }}>
              Your first story will be sent within 24 hours of completing the quiz. After that, a new story arrives on the 1st of each month.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  )
}

export default QuizInviteEmail
