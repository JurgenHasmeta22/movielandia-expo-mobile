import { ThemedText } from "@/components/themed-text";
import { authService } from "@/lib/api/auth.service";
import { Link } from "expo-router";
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

export default function ForgotPasswordScreen() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleForgotPassword = async () => {
		try {
			setError("");
			setLoading(true);

			if (!email) {
				setError("Please enter your email");
				return;
			}

			await authService.forgotPassword(email);
			setSuccess(true);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to send reset email";
					
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
							Email Sent!
						</ThemedText>
						<ThemedText style={styles.successText}>
							Check your email for password reset instructions.
						</ThemedText>
						<Link href="/signin" asChild>
							<Button
								mode="contained"
								style={styles.button}
								contentStyle={styles.buttonContent}
							>
								Back to Sign In
							</Button>
						</Link>
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
				<View style={styles.content}>
					<View style={styles.logoContainer}>
						<Image
							source={require("@/assets/images/logo.png")}
							style={styles.logo}
							resizeMode="contain"
						/>
					</View>

					<View style={styles.formContainer}>
						<ThemedText style={styles.title}>
							Forgot Password?
						</ThemedText>
						<ThemedText style={styles.subtitle}>
							Enter your email to receive reset instructions
						</ThemedText>

						<View style={styles.form}>
							<TextInput
								label="Email"
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

							{error ? (
								<HelperText type="error" visible={!!error}>
									{error}
								</HelperText>
							) : null}

							<Button
								mode="contained"
								onPress={handleForgotPassword}
								loading={loading}
								disabled={loading}
								style={styles.button}
								contentStyle={styles.buttonContent}
								icon="send"
							>
								Send Reset Email
							</Button>

							<Link href="/signin" asChild>
								<Button
									mode="text"
									disabled={loading}
									style={styles.linkButton}
								>
									Back to Sign In
								</Button>
							</Link>
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
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
		textAlign: "center",
		color: "white",
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 32,
		textAlign: "center",
		opacity: 0.9,
		color: "white",
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
	linkButton: {
		marginTop: -8,
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
		marginBottom: 24,
		textAlign: "center",
		opacity: 0.8,
	},
});
