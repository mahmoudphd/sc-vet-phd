import { 
    Card, 
    Flex, 
    Box, 
    Select,
    Text
  } from '@radix-ui/themes';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
  
  const LanguageSelector = () => {
    const { i18n } = useTranslation();
    // const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  
    const languages = [
      { id: 'en', name: 'English' },
      { id: 'ar', name: 'اللغة العربية' },
    ];


    // console.log(i18n)
  
    return (
      <Flex align="center" gap="1">
        <Box>
            <Text size="1">Change Language 🌍: </Text>
        </Box>
        <Select.Root
          value={i18n.language}
          onValueChange={v => i18n.changeLanguage(v)}
        >
          <Select.Trigger placeholder="Choose your language" />
          <Select.Content>
            {languages.map((language) => (
              <Select.Item
                key={language.id}
                value={language.id}
              >
                {language.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
    );
  };
  
  export default LanguageSelector;
  