import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../styles/theme';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        const result = await login(email.toLowerCase().trim(), password);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Login Failed', result.error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="parking" size={48} color={COLORS.primary} />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue to ParkEase</Text>
                    </View>

                    <View style={[styles.formCard, SHADOWS.card]}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleLogin}
                            disabled={loading}
                            style={[styles.button, SHADOWS.md]}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.card} />
                            ) : (
                                <Text style={styles.buttonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>New to ParkEase? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.signupLink}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.xl,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.sm,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes.xxl,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.textSecondary,
    },
    formCard: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
    },
    inputContainer: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: TYPOGRAPHY.weights.semibold,
        color: COLORS.text,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.surface,
    },
    inputIcon: {
        marginLeft: SPACING.md,
    },
    input: {
        flex: 1,
        padding: SPACING.md,
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.text,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    buttonText: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.card,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.surface,
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        color: COLORS.textSecondary,
        fontSize: TYPOGRAPHY.sizes.sm,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.textSecondary,
    },
    signupLink: {
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.primary,
    },
});

export default LoginScreen;
