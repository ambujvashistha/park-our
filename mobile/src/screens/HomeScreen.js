import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const { colors, isDarkMode } = useTheme();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: logout, style: 'destructive' },
            ]
        );
    };

    const renderMenuCard = (title, subtitle, icon, color, onPress) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.menuCard, SHADOWS.card, { backgroundColor: colors.card }]}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <MaterialCommunityIcons name={icon} size={32} color={color} />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            <Header
                title="Hello,"
                subtitle={user?.name || 'User'}
                showLogout
                onLogout={handleLogout}
                showThemeToggle
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.heroCard, SHADOWS.md, { backgroundColor: colors.primary }]}>
                    <View style={styles.heroContent}>
                        <Text style={[styles.heroTitle, { color: '#FFFFFF' }]}>Find Your Spot</Text>
                        <Text style={[styles.heroSubtitle, { color: 'rgba(255, 255, 255, 0.9)' }]}>Smart parking made easy</Text>
                        <TouchableOpacity
                            style={[styles.heroButton, { backgroundColor: colors.card }]}
                            onPress={() => navigation.navigate('VisitorDashboard')}
                        >
                            <Text style={[styles.heroButtonText, { color: colors.primary }]}>Park Now</Text>
                        </TouchableOpacity>
                    </View>
                    <MaterialCommunityIcons name="car-convertible" size={80} color={colors.card} style={styles.heroIcon} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
                <View style={styles.menuContainer}>
                    {user?.role === 'admin' && (
                        renderMenuCard(
                            'Admin Dashboard',
                            'Manage slots & settings',
                            'view-dashboard',
                            colors.primary,
                            () => navigation.navigate('AdminDashboard')
                        )
                    )}

                    {renderMenuCard(
                        'Visitor View',
                        'Find & reserve parking',
                        'map-marker-radius',
                        colors.accent,
                        () => navigation.navigate('VisitorDashboard')
                    )}

                    {renderMenuCard(
                        'Analytics',
                        'View parking statistics',
                        'chart-bar',
                        colors.secondary,
                        () => navigation.navigate('Analytics')
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    heroCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        height: 160,
    },
    heroContent: {
        flex: 1,
        zIndex: 1,
    },
    heroTitle: {
        fontSize: TYPOGRAPHY.sizes.xxl,
        fontWeight: TYPOGRAPHY.weights.bold,
        marginBottom: SPACING.xs,
    },
    heroSubtitle: {
        fontSize: TYPOGRAPHY.sizes.md,
        marginBottom: SPACING.lg,
    },
    heroButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        alignSelf: 'flex-start',
    },
    heroButtonText: {
        fontWeight: TYPOGRAPHY.weights.bold,
        fontSize: TYPOGRAPHY.sizes.sm,
    },
    heroIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        opacity: 0.3,
        transform: [{ rotate: '-15deg' }],
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.bold,
        marginBottom: SPACING.md,
    },
    menuContainer: {
        gap: SPACING.md,
    },
    menuCard: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: TYPOGRAPHY.weights.bold,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: TYPOGRAPHY.sizes.sm,
    },
});

export default HomeScreen;
