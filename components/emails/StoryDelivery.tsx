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

interface StoryDeliveryEmailProps {
  storyNumber: number
  storyTitle: string
  storyAuthor: string
  protagonistName: string
  personalizedText: string
  unsubscribeUrl: string
}

export function StoryDeliveryEmail({
  storyNumber,
  storyTitle,
  storyAuthor,
  protagonistName,
  personalizedText,
  unsubscribeUrl,
}: StoryDeliveryEmailProps) {
  // Convert newlines to paragraphs
  const paragraphs = personalizedText
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <Html>
      <Head />
      <Preview>Story #{String(storyNumber)} for {protagonistName} — {storyTitle}</Preview>
      <Body style={{ backgroundColor: '#fdf8f0', fontFamily: 'Georgia, serif', margin: 0 }}>
        <Container style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ backgroundColor: '#fff9f0', border: '1px solid #e8d5b7', borderRadius: '12px', padding: '48px' }}>
            {/* Header */}
            <Text style={{ color: '#8b7355', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 8px' }}>
              Story {storyNumber} of 12
            </Text>
            <Heading style={{ color: '#8b4513', fontSize: '32px', margin: '0 0 4px', lineHeight: '1.2' }}>
              {storyTitle}
            </Heading>
            <Text style={{ color: '#8b7355', fontSize: '14px', margin: '0 0 32px', fontStyle: 'italic' }}>
              Originally by {storyAuthor} — personalized for {protagonistName}
            </Text>

            <Hr style={{ borderColor: '#e8d5b7', margin: '0 0 32px' }} />

            {/* Story body */}
            {paragraphs.map((para, i) => (
              <Text
                key={i}
                style={{
                  color: '#2c1810',
                  fontSize: '17px',
                  lineHeight: '1.9',
                  margin: '0 0 20px',
                  textIndent: i === 0 ? 0 : '1.5em',
                }}
              >
                {para}
              </Text>
            ))}

            <Hr style={{ borderColor: '#e8d5b7', margin: '32px 0 24px' }} />

            <Text style={{ color: '#8b7355', fontSize: '13px', textAlign: 'center' }}>
              ✦ ✦ ✦
            </Text>
            <Text style={{ color: '#8b7355', fontSize: '13px', textAlign: 'center', marginTop: '8px' }}>
              Your next story arrives on the 1st of next month.
            </Text>
            <Text style={{ color: '#8b7355', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
              <a href={unsubscribeUrl} style={{ color: '#8b7355' }}>Unsubscribe</a>
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  )
}

export default StoryDeliveryEmail
