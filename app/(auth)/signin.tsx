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
	StyleSheet,
	View,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

const { width } = Dimensions.get("window");

export default function SignInScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const signIn = useAuthStore((state) => state.signIn);

	const handleSignIn = async () => {
		try {
			setError("");
			setLoading(true);

			if (!email || !password) {
				setError("Please fill in all fields");
				return;
			}

			await signIn(email, password);
			router.replace("/(tabs)");
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Invalid credentials";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

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
								label="Email or Username"
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
								label="Password"
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
										icon={showPassword ? "eye-off" : "eye"}
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

							{error ? (
								<HelperText type="error" visible={!!error}>
									{error}
								</HelperText>
							) : null}

							<Button
								mode="contained"
								onPress={handleSignIn}
								loading={loading}
								disabled={loading}
								style={styles.button}
								contentStyle={styles.buttonContent}
								icon="lock"
							>
								Sign In
							</Button>

							<View style={styles.dividerContainer}>
								<View style={styles.divider} />
								<ThemedText style={styles.dividerText}>
									OR
								</ThemedText>
								<View style={styles.divider} />
							</View>

							<Link href="/forgot-password" asChild>
								<Button
									mode="text"
									disabled={loading}
									style={styles.linkButton}
								>
									Forgot Password?
								</Button>
							</Link>

							<View style={styles.signupContainer}>
								<ThemedText style={styles.signupText}>
									{"Don't have an account? "}
								</ThemedText>
								<Link href="/signup" asChild>
									<Button
										mode="text"
										disabled={loading}
										compact
										labelStyle={styles.signupLink}
									>
										Sign Up
									</Button>
								</Link>
							</View>
						</View>
					</View>
				</View>
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
	content: {
		flex: 1,
		padding: 24,
		justifyContent: "center",
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 48,
	},
	logo: {
		width: Math.min(width * 0.6, 240),
		height: 75,
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
	linkButton: {
		marginTop: -8,
	},
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
	},
	signupText: {
		fontSize: 14,
	},
	signupLink: {
		fontWeight: "700",
	},
});
