import {
    Card,
    Flex,
    Heading,
    Text,
    Badge,
    Button,
    TextField,
    Box,
    Grid
  } from '@radix-ui/themes';
  import {
    PersonIcon,
    Link2Icon,
    CheckCircledIcon,
  } from '@radix-ui/react-icons';
  
  const ProfilePage = () => (
    <Card>
      <Flex direction="column" gap="4">
        <Heading size="6" className="flex items-center gap-2">
          <PersonIcon /> Blockchain Identity
        </Heading>
  
        <Grid columns="2" gap="4">
          <Card>
            <Flex direction="column" gap="3">
              <Text size="2" className="text-gray-500">Wallet Address</Text>
              <Flex align="center" gap="2">
                <Link2Icon className="text-indigo-600" />
                <Text className="font-mono">0x892...F1A2</Text>
                <Badge color="green" variant="soft">
                  <CheckCircledIcon /> Verified
                </Badge>
              </Flex>
            </Flex>
          </Card>
  
          <Card>
            <Flex direction="column" gap="3">
              <Text size="2" className="text-gray-500">Node Connection</Text>
              <Flex align="center" gap="2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <Text>Connected to Mainnet</Text>
                <Badge variant="soft">Block 18,245,201</Badge>
              </Flex>
            </Flex>
          </Card>
        </Grid>
  
        <Card>
          <Heading size="4" mb="4">Organization Details</Heading>
          <Grid columns="3" gap="4">
            <TextField.Root>
              <input placeholder="Company Name" value="VetChain Pharma" />
            </TextField.Root>
            <TextField.Root>
              <input placeholder="Smart Contract Address" value="0xVET...CH01" />
            </TextField.Root>
            <TextField.Root>
              <input placeholder="Node Version" value="Geth/v1.12.0" />
            </TextField.Root>
          </Grid>
        </Card>
  
        <Card>
          <Flex justify="between" align="center">
            <Heading size="4">Digital Identity QR</Heading>
            <Button variant="soft">
              QRCodeIco Generate New
            </Button>
          </Flex>
          <Box className="mt-4 w-48 h-48 bg-gray-100 flex items-center justify-center">
            {/* <QRCodeIcon className="w-16 h-16 text-gray-400" /> */}
          </Box>
        </Card>
  
        <Flex gap="3" justify="end">
          <Button variant="soft">Cancel</Button>
          <Button>Save Changes</Button>
        </Flex>
      </Flex>
    </Card>
);

export default ProfilePage