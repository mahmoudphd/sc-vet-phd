import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import {
    Card,
    Flex,
    Heading,
    Text,
    Button,
    Dialog,
    Spinner,
    Box,
    Container,
    Grid
} from '@radix-ui/themes';
import { ArrowTopRightIcon, CheckIcon } from '@radix-ui/react-icons';

interface Props {
    walletAddress: string | null;
    setWalletAddress: (address: string | null) => void;
}

export default function PremiumLogin({ setWalletAddress, walletAddress }: Props) {
    const { t } = useTranslation('premium-login');
    const [isConnecting, setIsConnecting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const gradientStyle = {
        background: `linear-gradient(135deg, rgba(22,25,37,1) 0%, rgba(42,48,74,1) 100%)`,
    };

    const handleSignature = async (provider: ethers.BrowserProvider, address: string) => {
        try {
            const signer = await provider.getSigner();
            const nonce = await generateNonce(address);
            const signature = await signer.signMessage(`SupplyChainAuth: ${nonce}`);

            await verifySignature(address, signature, nonce);
        } catch (err) {
            setError(t('signature-authentication-error'));
        }
    };

    const generateNonce = async (address: string) => address;
    const verifySignature = async (address: string, signature: string, nonce: string) => { /* ... */ };

    const handleMetamaskLogin = async () => {
        try {
            setIsConnecting(true);
            if (!window.ethereum) {
                throw new Error(t('metaMask-not-installed-error'));
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setWalletAddress(accounts[0]);
            await handleSignature(provider, accounts[0]);
            setShowSuccess(true);
        } catch (err) {
            // Handle error with toast
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <Grid columns="2" style={{ minHeight: '100vh' }}>
            <Box style={gradientStyle} className="animate-fade-in">
                <Flex direction="column" justify="end" align="center" height="100vh" gap="5" className="relative">
                    <img
                        src="https://plus.unsplash.com/premium_photo-1682146420929-762f3a79e529?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Supply Chain"
                        className="w-full h-full absolute"
                    />
                    <Box className="mb-14 z-10">
                        <Heading size="8" weight="bold" className="text-white z-10">
                            {t('next-gen-supply-chain-management')}
                        </Heading>
                        <Text size="4" className="text-gray-300 z-10 text-center px-12">
                            {t('secure-decentralized-logistics')}
                        </Text>
                    </Box>
                </Flex>
            </Box>

            <Container size="2" p="8" className="relative">
                <Flex justify="center" align="center" height="100vh">
                    <Card size="4" style={{
                        width: 480,
                        backdropFilter: 'blur(12px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <Flex direction="column" gap="6" p="6">
                            <Flex justify="center" gap="2" align="start">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Future_Supply_Chains_Logo.jpg/1280px-Future_Supply_Chains_Logo.jpg"
                                    alt="Company Logo"
                                    className="h-24"
                                />
                                <Text weight="bold" className="text-gray-400">
                                    v2.0
                                </Text>
                            </Flex>

                            <Flex direction="column" gap="1">
                                <Heading size="7" weight="bold" className="text-white">
                                    {t('welcome-back')}
                                </Heading>
                                <Text size="4" className="text-gray-400">
                                    {t('secure-dashboard-access')}
                                </Text>
                            </Flex>

                            <Flex direction="column" gap="4">
                                {!walletAddress ? (
                                    <Button
                                        size="3"
                                        onClick={handleMetamaskLogin}
                                        disabled={!window.ethereum || isConnecting}
                                        style={{
                                            backgroundColor: '#F6851B',
                                            height: 48,
                                            cursor: isConnecting ? 'wait' : 'pointer'
                                        }}
                                        className="hover:brightness-110 transition-all"
                                    >
                                        {isConnecting ? (
                                            <Spinner loading />
                                        ) : (
                                            <Flex gap="3" align="center" className="cursor-pointer">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"
                                                    className="h-6 w-6"
                                                    alt="MetaMask"
                                                />
                                                <Text weight="bold">
                                                    {t('continue-with-metamask')}
                                                </Text>
                                            </Flex>
                                        )}
                                    </Button>
                                ) : (
                                    <Flex direction="column" gap="4">
                                        <Flex
                                            justify="center"
                                            align="center"
                                            gap="3"
                                            className="bg-green-900/20 p-4 rounded-lg border border-green-800/50"
                                        >
                                            <CheckIcon className="text-green-400 w-6 h-6" />
                                            <Text weight="medium" className="text-green-400">
                                                {t('wallet-connected-successfully')}
                                            </Text>
                                        </Flex>

                                        <Flex direction="column" gap="2">
                                            <Button
                                                size="3"
                                                style={{ height: 48 }}
                                                className="bg-indigo-600 hover:bg-indigo-500 transition-colors"
                                            >
                                                <Flex gap="2" align="center">
                                                    {t('enter-dashboard')}
                                                    <ArrowTopRightIcon />
                                                </Flex>
                                            </Button>

                                            <Text
                                                size="2"
                                                className="text-center text-gray-400 cursor-pointer hover:text-gray-300"
                                                onClick={() => setWalletAddress(null)}
                                            >
                                                {t('connect-different-wallet')}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                )}
                            </Flex>

                            <Flex justify="center" gap="2" className="mt-8">
                                <Text size="2" className="text-gray-400">
                                    {t('need-help-connecting')}
                                </Text>
                                <Text
                                    size="2"
                                    weight="bold"
                                    className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                                >
                                    {t('contact-support')}
                                </Text>
                            </Flex>
                        </Flex>
                    </Card>
                </Flex>

                <Dialog.Root open={showSuccess} onOpenChange={setShowSuccess}>
                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Flex gap="4" align="start">
                            <div className="bg-green-500/20 p-3 rounded-full">
                                <CheckIcon className="w-6 h-6 text-green-400" />
                            </div>
                            <Flex direction="column" gap="2">
                                <Dialog.Title>{t('authentication-successful')}</Dialog.Title>
                                <Dialog.Description className="text-gray-400">
                                    {t('authentication-successful-description')}
                                </Dialog.Description>
                            </Flex>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            </Container>

            <div className="absolute bottom-8 left-8 flex gap-2 items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <Text size="2" className="text-gray-400">
                    {t('secure-blockchain-connection')}
                </Text>
            </div>
        </Grid>
    );
}