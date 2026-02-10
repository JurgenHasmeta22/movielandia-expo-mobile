import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { authService } from "@/lib/api/auth.service";
import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput, Title } from "react-native-paper";

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
			<ThemedView style={styles.container}>
				<View style={styles.successContainer}>
					<Title style={styles.title}>Email Sent!</Title>
					<ThemedText style={styles.subtitle}>
						Check your email for password reset instructions.
					</ThemedText>
					<Link href="/signin" asChild>
						<Button mode="contained" style={styles.button}>
							Back to Sign In
						</Button>
					</Link>
				</View>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<View style={styles.content}>
					<Title style={styles.title}>Forgot Password?</Title>
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
						>
							Send Reset Email
						</Button>

						<Link href="/signin" asChild>
							<Button mode="text" disabled={loading}>
								Back to Sign In
							</Button>
						</Link>
					</View>
				</View>
			</KeyboardAvoidingView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	content: {
		flex: 1,
		padding: 24,
		justifyContent: "center",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 8,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 32,
		textAlign: "center",
		opacity: 0.7,
	},
	form: {
		gap: 16,
	},
	input: {
		marginBottom: 8,
	},
	button: {
		marginTop: 8,
		paddingVertical: 6,
	},
	successContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
});
