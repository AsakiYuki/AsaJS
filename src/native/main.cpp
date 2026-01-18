#include <napi.h>
#include <format>
#include <regex>

enum TokenKind {
	VARIABLE,
	NUMBER,
	STRING,
	TEMPLATE_STRING,
	WORD,

	OPEN_PARENTHESIS,
	CLOSE_PARENTHESIS,

	OPERATOR,
	COMMA,
};

namespace Lexer {
	bool isBlankChar(char c) {
		std::regex pattern(R"(\s)");
		return std::regex_match(std::string(1, c), pattern);
	};

	bool isWordChar(char c) {
		std::regex pattern(R"(\w)");
		return std::regex_match(std::string(1, c), pattern);
	}

	bool isNumberChar(char c) {
		std::regex pattern(R"(\d)");
		return std::regex_match(std::string(1, c), pattern);
	}

	Napi::Object makeToken(Napi::Env &env, const std::string &input, TokenKind kind, size_t start, size_t length = 1) {
		Napi::Object token = Napi::Object::New(env);

		token.Set(Napi::String::New(env, "start"), Napi::Number::New(env, start));
		token.Set(Napi::String::New(env, "length"), Napi::Number::New(env, length));
		token.Set(Napi::String::New(env, "kind"), Napi::Number::New(env, kind));
		token.Set(Napi::String::New(env, "value"), Napi::String::New(env, input.substr(start, length)));

		return token;
	}

	Napi::Array Lexer(const Napi::CallbackInfo &info) {
		Napi::Env env = info.Env();
	
		Napi::Function consoleLog = env.Global().Get("console").As<Napi::Object>().Get("log").As<Napi::Function>();

		if (info.Length() != 1) {
			Napi::TypeError::New(env, "One string argument required").ThrowAsJavaScriptException();
			return Napi::Array::New(env, 0);
		}

		if (!info[0].IsString()) {
			Napi::TypeError::New(env, "Input must be a string").ThrowAsJavaScriptException();
			return Napi::Array::New(env, 0);
		}

		const std::string input = info[0].As<Napi::String>().Utf8Value();
		const size_t length = input.size();
		
		if (length == 0) {
			return Napi::Array::New(env, 0);
		}

		std::vector<Napi::Object> tokens;
		
		size_t index = 0;
		while (index < length) {
			char c = input[index];

			switch (c) {
				// Literals
				case '#':
				case '$': {
					const size_t start = index++;

					while (index < length) {
						const char c = input[index];
						if (Lexer::isWordChar(c)) index++;
						else break;
					}

					tokens.push_back(makeToken(env, input, TokenKind::VARIABLE, start, index-- - start));
					break;
				} break;

				case '\'': {
					const size_t start = index++;

					while (index < length) {
						const char c = input[index];
						if (c == '\'') break;
						index++;
					}

					tokens.push_back(makeToken(env, input, TokenKind::STRING, start, index - start + 1));
				} break;

				case ',':
					tokens.push_back(makeToken(env, input, TokenKind::COMMA, index));
					break;

				// Single operators
				case '+':
				case '-':
				case '*':
				case '/':
				case '%':
					tokens.push_back(makeToken(env, input, TokenKind::OPERATOR, index));
					break;

				case '(':
					tokens.push_back(makeToken(env, input, TokenKind::OPEN_PARENTHESIS, index));
					break;

				case ')':
					tokens.push_back(makeToken(env, input, TokenKind::CLOSE_PARENTHESIS, index));
					break;

				// Double operators
				case '&':
				case '|':
				case '=':
					if (input[index + 1] == input[index]) tokens.push_back(makeToken(env, input, TokenKind::OPERATOR, index++, 2));
					else tokens.push_back(makeToken(env, input, TokenKind::OPERATOR, index));
					break;

				case '!':
				case '>':
				case '<':
					if (input[index + 1] == '=') tokens.push_back(makeToken(env, input, TokenKind::OPERATOR, index++, 2));
					else tokens.push_back(makeToken(env, input, TokenKind::OPERATOR, index));
					break;

				default: {
					const size_t start = index;

					if (Lexer::isNumberChar(c)) {
						while (Lexer::isNumberChar(input[index + 1])) index++;
						tokens.push_back(
							Lexer::makeToken(env, input, TokenKind::NUMBER, start, index - start + 1)
						);
					} else if (Lexer::isWordChar(c)) {
						while (Lexer::isWordChar(input[index + 1])) index++;
						tokens.push_back(
							Lexer::makeToken(env, input, TokenKind::WORD, start, index - start + 1)
						);
					} else if (!Lexer::isBlankChar(c)) {
						std::string message = std::format(
							"\x1b[31m{}>>>{}<<<{}\nInvalid character\x1b[0m",
							input.substr(0, start),
							input.substr(start, index - start + 1),
							input.substr(index + 1)
						);

						Napi::TypeError::New(env, Napi::String::New(env, message)).ThrowAsJavaScriptException();
						return Napi::Array::New(env, 0);
					}
				} break;
			};

			index++;
		}

		size_t tokenLength = tokens.size();
		Napi::Array result = Napi::Array::New(env, tokenLength);

		for (size_t i = 0; i < tokenLength; i++) 
			result.Set(i, tokens[i]);

		return result;
	}
};

Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set(
		Napi::String::New(env, "Lexer"),
		Napi::Function::New(env, Lexer::Lexer)
	);

	return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)