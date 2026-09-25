package storage

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func Open(ctx context.Context, endpoint, region, accessKey, secretKey string) (*s3.Client, error) {
	options := []func(*config.LoadOptions) error{config.WithRegion(region)}
	if accessKey != "" || secretKey != "" {
		options = append(options, config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(accessKey, secretKey, ""),
		))
	}
	configuration, err := config.LoadDefaultConfig(ctx, options...)
	if err != nil {
		return nil, err
	}
	return s3.NewFromConfig(configuration, func(options *s3.Options) {
		if endpoint != "" {
			options.BaseEndpoint = aws.String(endpoint)
			options.UsePathStyle = true
		}
	}), nil
}

func Check(ctx context.Context, client *s3.Client, bucket string) error {
	_, err := client.HeadBucket(ctx, &s3.HeadBucketInput{Bucket: aws.String(bucket)})
	return err
}
