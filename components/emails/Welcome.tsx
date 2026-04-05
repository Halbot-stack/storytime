import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Preview,
} from '@react-email/components'

interface WelcomeEmailProps {
  protagonistName: string
  firstStoryDate: string
}

export function WelcomeEmail({ protagonistName, firstStoryDate }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your first story is on its way, {protagonistName}!</Preview>
      <Body style={{ backgroundColor: '#fdf8f0', fontFamily: 'Georgia, serif', margin: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ backgroundColor: '#fff9f0', border: '1px solid #e8d5b7', borderRadius: '12px', padding: '40px' }}>
            <Heading style={{ color: '#8b4513', fontSize: '28px', marginBottom: '8px' }}>
              📖 Your story journey begins!
            </Heading>

            <Hr style={{ borderColor: '#e8d5b7', margin: '24px 0' }} />

            <Text style={{ color: '#2c1810', fontSize: '16px', lineHeight: '1.7' }}>
              Thank you for sharing your preferences with us. We&apos;ve crafted your personalized story profile and your first story is already being prepared.
            </Text>

            <Text style={{ color: '#2c1810', fontSize: '16px', lineHeight: '1.7' }}>
              Your first story arrives: <strong>{firstStoryDate}</strong>
            </Text>

            <Text style={{ color: '#2c1810', fontSize: '16px', lineHeight: '1.7' }}>
              After that, a new story will arrive on the <strong>1st of every month</strong> for the next year. Each one is drawn from a beloved public domain classic and woven around you — your name, your themes, your world.
            </Text>

            <div style={{ backgroundColor: '#fdf8f0', border: '1px solid #e8d5b7', borderRadius: '8px', padding: '20px', margin: '24px 0', textAlign: 'center' }}>
              <Text style={{ color: '#8b4513', fontSize: '18px', fontStyle: 'italic', margin: 0 }}>
                &ldquo;There is no friend as loyal as a book.&rdquo;
              </Text>
              <Text style={{ color: '#8b7355', fontSize: '13px', marginTop: '8px' }}>
                — Ernest Hemingway
              </Text>
            </div>

            <Hr style={{ borderColor: '#e8d5b7', margin: '24px 0' }} />

            <Text style={{ color: '#8b7355', fontSize: '13px' }}>
              Questions? Reply to this email anytime. We read every message.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
