import { Button } from "@radix-ui/themes";

interface TwitterLoginProps {
  onLogin?: () => void;
}

export function TwitterLogin({ onLogin }: TwitterLoginProps) {
  const handleTwitterLogin = () => {
    // Redirect to backend auth endpoint
    window.location.href = 'http://localhost:8888/auth/signin/twitter';
  };

  return (
    <Button 
      onClick={handleTwitterLogin}
      style={{
        backgroundColor: '#1DA1F2',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      Login with Twitter
    </Button>
  );
}
