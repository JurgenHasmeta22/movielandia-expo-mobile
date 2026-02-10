import { ThemedText } from "@/components/themed-text";
import { useAuthStore } from "@/store/auth.store";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
	Dimensions,
	Image,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

const { width } = Dimensions.get("window");

export default function SignUpScreen() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const signUp = useAuthStore((state) => state.signUp);

	const handleSignUp = async () => {
		try {
			setError("");
			setLoading(true);

			if (!email || !username || !password || !confirmPassword) {
				setError("Please fill in all required fields");
				return;
			}

			if (password !== confirmPassword) {
				setError("Passwords do not match");
				return;
			}

			if (password.length < 8) {
				setError("Password must be at least 8 characters");
				return;
			}

			await signUp(email, password, username);
			setSuccess(true);

			setTimeout(() => {
				router.replace("/signin");
			}, 2000);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create account";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<ImageBackground
				source={require("@/assets/images/background.png")}
				style={styles.background}
				resizeMode="cover"
			>
				<View style={styles.overlay} />
				<View style={styles.successContainer}>
					<View style={styles.successCard}>
						<Image
							source={require("@/assets/images/logo.png")}
							style={styles.logoSmall}
							resizeMode="contain"
						/>
						<ThemedText style={styles.successTitle}>
							Account Created!
						</ThemedText>
						<ThemedText style={styles.successText}>
							Please check your email to verify your account.
						</ThemedText>
						<ThemedText style={styles.successText}>
							Redirecting to sign in...
						</ThemedText>
					</View>
				</View>
			</ImageBackground>
		);
	}

	return (
		<ImageBackground
			source={require("@/assets/images/background.png")}
			style={styles.background}
			resizeMode="cover"
		>
			<View style={styles.overlay} />
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.content}>
						<View style={styles.logoContainer}>
							<Image
								source={require("@/assets/images/logo.png")}
								style={styles.logo}
								resizeMode="contain"
							/>
						</View>

						<View style={styles.formContainer}>
							<View style={styles.form}>
								<TextInput
									label="Username *"
									value={username}
									onChangeText={setUsername}
									autoCapitalize="none"
									mode="outlined"
									style={styles.input}
									error={!!error}
									disabled={loading}
									left={<TextInput.Icon icon="account" />}
									textColor="#000000"
									theme={{
										roundness: 8,
										colors: {
											onSurfaceVariant: "#666666",
										},
									}}
								/>

								<TextInput
									label="Email *"
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
									mode="outlined"
									style={styles.input}
									error={!!error}
									disabled={loading}
									left={<TextInput.Icon icon="email" />}
									textColor="#000000"
									theme={{
										roundness: 8,
										colors: {
											onSurfaceVariant: "#666666",
										},
									}}
								/>

								<TextInput
									label="Password *"
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!showPassword}
									mode="outlined"
									style={styles.input}
									error={!!error}
									disabled={loading}
									left={<TextInput.Icon icon="lock" />}
									right={
										<TextInput.Icon
											icon={
												showPassword ? "eye-off" : "eye"
											}
											onPress={() =>
												setShowPassword(!showPassword)
											}
										/>
									}
									textColor="#000000"
									theme={{
										roundness: 8,
										colors: {
											onSurfaceVariant: "#666666",
										},
									}}
								/>

								<TextInput
									label="Confirm Password *"
									value={confirmPassword}
									onChangeText={setConfirmPassword}
									secureTextEntry={!showPassword}
									mode="outlined"
									style={styles.input}
									error={!!error}
									disabled={loading}
									left={<TextInput.Icon icon="lock-check" />}
									textColor="#000000"
									theme={{
										roundness: 8,
										colors: {
											onSurfaceVariant: "#666666",
										},
									}}
								/>

								{error ? (
									<HelperText type="error" visible={!!error}>
										{error}
									</HelperText>
								) : null}

								<Button
									mode="contained"
									onPress={handleSignUp}
									loading={loading}
									disabled={loading}
									style={styles.button}
									contentStyle={styles.buttonContent}
									icon="account-plus"
								>
									Sign Up
								</Button>

								<View style={styles.dividerContainer}>
									<View style={styles.divider} />
									<ThemedText style={styles.dividerText}>
										OR
									</ThemedText>
									<View style={styles.divider} />
								</View>

								<View style={styles.signinContainer}>
									<ThemedText style={styles.signinText}>
										Already have an account?{" "}
									</ThemedText>
									<Link href="/signin" asChild>
										<Button
											mode="text"
											disabled={loading}
											compact
											labelStyle={styles.signinLink}
										>
											Sign In
										</Button>
									</Link>
								</View>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingVertical: 24,
	},
	content: {
		flex: 1,
		padding: 24,
		justifyContent: "center",
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 48,
		marginTop: 24,
	},
	logo: {
		width: Math.min(width * 0.6, 240),
		height: 75,
	},
	logoSmall: {
		width: Math.min(width * 0.5, 200),
		height: 60,
		marginBottom: 24,
	},
	formContainer: {
		maxWidth: 400,
		width: "100%",
		alignSelf: "center",
	},
	form: {
		gap: 16,
	},
	input: {
		backgroundColor: "rgba(255, 255, 255, 0.95)",
	},
	button: {
		marginTop: 8,
	},
	buttonContent: {
		paddingVertical: 8,
	},
	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 8,
	},
	divider: {
		flex: 1,
		height: 1,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
	},
	dividerText: {
		marginHorizontal: 16,
		fontSize: 14,
		fontWeight: "600",
		opacity: 0.7,
	},
	signinContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
	},
	signinText: {
		fontSize: 14,
	},
	signinLink: {
		fontWeight: "700",
	},
	successContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	successCard: {
		backgroundColor: "rgba(255, 255, 255, 0.95)",
		borderRadius: 16,
		padding: 32,
		alignItems: "center",
		maxWidth: 400,
		width: "100%",
	},
	successTitle: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
		color: "#1976d2",
	},
	successText: {
		fontSize: 16,
		marginBottom: 8,
		textAlign: "center",
		opacity: 0.8,
	},
});
